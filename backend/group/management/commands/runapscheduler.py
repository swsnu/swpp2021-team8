# runapscheduler.py
import logging
import calendar
from datetime import datetime
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from django.conf import settings
from django.core.management.base import BaseCommand
from django_apscheduler.jobstores import DjangoJobStore
from notification.models import Notification
from group.models import Group

logger = logging.getLogger(__name__)

def delete_group():
    """
    Delete group whose will_be_deleted field is True
    Start midnight everyday, before start of next day
    """
    # today
    today = datetime.date(datetime.now())
    day = int(today.strftime("%d"))

    # Case 1
    # today is right before payday
    # e.g) payday is 4, and today is 3
    Group.objects.filter(will_be_deleted=True, payday=day+1).delete()

    # Case 2
    # today is last day of month, but payday is greater than today's date.
    # e.g) payday is 30, and today is Feb. 28
    end_of_day = int(today.replace(day = calendar.monthrange(today.year, today.month)[1]).strftime("%d"))

    if day == end_of_day:
        Group.objects.filter(will_be_deleted=True, payday__gt=day).delete()

def delete_group_notification():
    """
    Send notification to user whose group will be deleted
    """
    for group in Group.objects.filter(will_be_deleted=True):
        for member in group.members.all():
            Notification(receiver=member, type="delete", content="{0} will be deleted".format(group.name)).save()

def payday_notification():
    """
    Send payday notification to users whose payday is today
    """
    # today
    today = datetime.date(datetime.now())
    day = int(today.strftime("%d"))
    end_of_day = int(today.replace(day = calendar.monthrange(today.year, today.month)[1]).strftime("%d"))

    for group in Group.objects.filter(payday=day):
        for member in group.members.all():
            Notification(receiver=member, type="payday", content="Today is your payday for group {0}".format(group.name)).save()

    if day == end_of_day:
        for group in Group.objects.filter(payday__gt=day).values():
            for member in group.members.all():
                Notification(receiver=member, type="payday", content="Today is your payday for group {0}".format(group.name)).save()


class Command(BaseCommand):
    help = "Runs APScheduler."

    def handle(self, *args, **options):
        scheduler = BlockingScheduler(timezone=settings.TIME_ZONE)
        scheduler.add_jobstore(DjangoJobStore(), "default")

        scheduler.add_job(
            delete_group,
            trigger=CronTrigger(hour="00", minute="00"),  # Start of every day
            id="delete_group",  # The `id` assigned to each job MUST be unique
            max_instances=1,
            replace_existing=True,
        )
        logger.info("Added job 'delete_group'.")

        scheduler.add_job(
            payday_notification,
            trigger=CronTrigger(hour="00", minute="00"),  # Start of every day
            id="payday_notification",  # The `id` assigned to each job MUST be unique
            max_instances=1,
            replace_existing=True,
        )
        logger.info("Added job 'payday_notification'.")

        scheduler.add_job(
            delete_group_notification,
            trigger=CronTrigger(hour="00", minute="00"),  # Start of every day
            id="delete_group_notification",  # The `id` assigned to each job MUST be unique
            max_instances=1,
            replace_existing=True,
        )
        logger.info("Added job 'delete_group_notification'.")

        try:
            logger.info("Starting scheduler...")
            scheduler.start()
        except KeyboardInterrupt:
            logger.info("Stopping scheduler...")
            scheduler.shutdown()
            logger.info("Scheduler shut down successfully!")
