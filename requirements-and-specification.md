## Document Revision History<br />

Rev. 1.0. `10/14/2021`

## Project Abstraction<br />

**Subroker** is a service which gathers and maintains groups for subscribing OTT service. It also provides personal content recommendations, and suggests OTT services which have those contents. Users can create, edit and join the groups, and manage every group that he or she owns or participates in on the user information page. Monthly subscription fee and payment schedule is organized and easily checked from this page, too. Favorite movies list is available for each user, and a machine learning algorithm recommends new movies according to this list.

## Customer<br />

In general, we are targeting people who want to subscribe to OTT services but think that paying 10 bucks alone per month is too much. With Subroker, people can find and join groups for OTT services that they want to use, and they can even create a new group as a group leader. Also, we expect people who want to know which contents would fit for them based on their favorite contents use our service.

## Market Competitors<br />

- **Buts**

  - Similarly people can create and join groups for OTT services
  - Only for group making and managing
  - Users cannot get information about contents and OTT services.

- **4Flix**

  - OTT service community with subscription group gathering forum.
  - Interface and functionality is not optimized for subscription groups.
  - Only for gathering groups, so it lacks group management features.

- **Carrots/Every Time**
  - People create posts looking for group members.
  - They have to chat through the app.

### Differentiation from competitors.<br />

- With Subroker, people can find which platforms are available for the content that they wish to watch.
- People can search and filter groups easily.
- Subroker has a content recommendation feature based on user data.
- Subroker provides a list of OTT services which has recommended contents.
- Every monthly payment of all participating groups are managed and organized in each user’s page.
- Fancy and attractive user interface based on color gradation theme which is also easy to use.

## User Stories<br />

### Story #1<br />

#### Meta Specs:

- Feature: Log in
- Actor: Those who want to use the ‘Subroker’ service
- Precondition: User has signed up before, but has not logged in yet & is in the Login/Sign up screen.

#### Scenario:

1. When a user enters ‘Subroker’ website or tries to enter some other page of ‘Subroker’, the system displays log-in screen.
2. User inputs email and password
3. System checks inputs for validation.
4. If either id or password is wrong, error message pops up and the user returns to log-in page.
5. If id and password are both correct, the user is redirected to the main page.

### Story #2<br />

#### Meta Specs:

- Feature: Sign up
- Actor: Those who want to use the ‘Subroker’ service
- Precondition: User does not have an account yet & is in the Login/Sign up screen

#### Scenario:

1. User clicks the ‘sign in’ button on the log-in page.
2. User is redirected to a sign-in form page and asked to fill in a form with email, password and username.
3. When they have provided satisfactory login credentials, the user may click on the ‘create account’ button.
4. If the user types in an email or an username that’s already taken, a pop up will guide the user to type in another email address or another username. If the password the user typed in twice does not match each other, a pop up will guide the user to check the password.
5. If all email, password and username are valid, the user is redirected to the login page, and a new account is created.

#### Exceptions:

- The email or username the user typed in is already taken.
- The two passwords the user typed in doesn’t match.
- User exits without finishing the process

#### Acceptance Test:

- **Given** that the user has provided satisfactory login credentials (i.e. proper email, username and password)
- **When** the user clicks on create account button
- **Then** the system should create a new user entry in the database associated with the login credentials provided<br />
  (All features/stories from this point onward require the user to be logged in as a precondition)

### Story #3<br />

#### Meta Specs:

- Feature: Log out
- Actor: Those who want to exit the ‘Subroker’ page
- Precondition: User is in any page of ‘Subroker’

#### Scenario:

1. When a user clicks the logout button from anywhere in the ‘Subroker’ website, the user is redirected to the login page.

### Story #4<br />

#### Meta Specs:

- Feature: Group Creation
- Actor: Those who want to be a group leader and create a new group.
- Precondition: A User is logged in.

#### Scenario:

1. User clicks a ‘Create a Group’’ button on the group list page.
2. User is redirected to a group creation page and selects a OTT service from a list of icons to make a group with
3. User selects a membership plan (deactivated until the user selects an OTT service) from a drop-down menu, which is determined from the previously selected OTT service.
4. User selects the number of group members from a drop-down menu, and types in a monthly payment fee. The maximum group member in the list is determined from the previously selected membership plan Also, he or she selects the subscription period of the group from the date selection field.
5. User selects whether the group is public or private from a checkbox. If he or she selects a private, group password field and group password check field appears. User types in a password twice, and if two passwords are not identical, an “Invalid” message is displayed.
6. User types in a group name and a group description in each field.
7. User clicks the “Confirm” button. a pop-up displays “Group creation succeeded” or “Group creation failed”. If group creation is successful, the group information that the user provided is saved in DB and the group is shown on the group list page.

#### Exceptions:

- The two group passwords the user typed in doesn’t match.
- User clicks “Cancel” button”

#### Acceptance Test:

- **Given** a logged in user selects and types in the group information (OTT service, membership plan, number of group members, subscription period, price, public/private, and optionally group password)
- **When** the user clicks “Confirm” button
- **Then** the system creates an entry in DB with the information the user provided, and displays whether the creation process is successful or not.

### Story #5<br />

#### Meta Specs:

- Feature: Group Edit
- Actor: Those who want to modify the group information.
- Precondition: A User is the leader of the group to edit.

#### Scenario:

1. User clicks a ‘Edit a Group’’ button on the group detail page. This button is only shown to the group leader.
2. User is redirected to a group edit page, which already contains every information about the group in the drop-down menus and text fields.
3. User modifies the information on each field, except the OTT service and the membership plan. Aslo, user cannot decrease the maximum number of group members below current number of group members.
4. If there is any difference from original data, a confirm button is activated. Otherwise, the confirm button is deactivated and only a cancel button is activated.
5. User clicks the “Confirm” button. a pop-up displays “Group edit succeeded” or “Group edit failed”. If group edit is successful, the group information that the user modified is saved in DB and the changed group information is shown on the group list and group detail page.

#### Exceptions:

- The two group passwords the user typed in doesn’t match.
- User clicks “Cancel” button”
- If a modified maximum number of group members is less than the current number of group members due to a new member joining during the modification, an error message is displayed and returned to the edit page.

#### Acceptance Test:

- **Given** a logged in user is in the group detail page of a group which the user is a group leader.
- **When** the user clicks “Edit a Group” button
- **Then** the user is redirected to the group edit page, which is the same form with group creation page, but all the fields are filled with the group information (OTT service, membership plan, number of group members, subscription period, price, public/private, and optionally group password)

- **Given** a logged in, group leader user modifies the group information in a group edit page
- **When** the user clicks “Confirm” button
- **Then** the system modifies an entry in DB with the information the user provided, and displays whether the edit process is successful or not.

### Story #6<br />

#### Meta Specs:

- Feature: Group Deletion
- Actor: Those who want to delete a group
- Precondition: A User is the leader of the group to delete.

#### Scenario:

1. User clicks a ‘Delete a Group’’ button on the group detail page. This button is only shown to the group leader.
2. Confirmation pop-up with confirm and cancel button shows up. If the user clicks the cancel button, the pop-up goes down and gets back to the group detail page.
3. User clicks the “Confirm” button. a pop-up displays “Group delete succeeded” or “Group delete failed”. If group delete is successful, the group information of the group is deleted from DB and the group disappears from the group list page.

#### Exceptions:

- User clicks “cancel” button”

#### Acceptance Test:

- **Given** a logged in user is in the group detail page of a group which the user is a group leader.
- **When** the user clicks “Delete a Group” - “Confirm” button
- **Then** the system deletes an entry in DB with the information of the group, and displays whether the delete process is successful or not.

### Story #7<br />

#### Meta Specs:

- Feature: Group Search
- Actor: Those who want to search for groups

#### Scenario:

1. User wants to search for some groups in the group list page.
2. User types some keywords in the search engine, or types nothing
3. User also can click the Filter button.
4. If the user clicks the filter button, a filter list opens in the group list page.
5. The filter list has several categories in a row, and each category has several keywords, or ranges.
6. User can click the checkbox in some categories(ex: OTT, membership, public/private, etc), or set a range in other categories(ex: fee, time span, # members). the user can click multiple keywords in a category.
7. User can click the ‘Search’ button with search keyword and filters.
8. If the user clicks the Search button, groups satisfying the condition are listed in the group list page.
9. If there is no group for the condition, ‘No group’ message appears on the list.

#### Acceptance Test:

- **Given** that the user has set some filters,
- **When** the user clicks on Search button,
- **Then** the system should show the filtered group list from the database

### Story #8 <br />

#### Meta Specs:

- Feature: Group Join
- Actor: Those who want to join a new subscription group
- Precondition: User is not a member of the target group

#### Scenario:

1. User watches the group list page and chooses a group that the user wants to join.
2. User clicks the group on the group list page.
3. If the group is ‘private’, a prompt comes up and the user should type the right password in it.
4. User is redirected to the group detail page and reads details of the group.
5. Since the user has not joined the group, there is a ‘Join’ button rather than an ‘Exit’ button.
6. If the group is full, the ‘Join’ button is not activated.
7. User can click the ‘Join’ button If the user is satisfied with the condition of the group.
8. If the user clicks the button, the user joins the group. The user is still in the group detail page.

#### Exceptions:

- The password user typed in is wrong
- Another user joins before the user clicks the join button

#### Acceptance Test:

- **Given** that the user is satisfied with the condition,
- **When** the user clicks on Join button,
- **Then** The system updates the participant list of the target group, and the group list of the user in the database, and the user may view the target group in his/her myPage, and view the updated participant list, exit button in the group detail page

### Story #9 <br />

#### Meta Specs:

- Feature: Manage groups that users are currently joining
- Actor: Those who want to manage groups and check payment date
- Precondition: User is on “My Page”, and user should be already joining at least 1 group.

#### Scenario:

1. User enters “My page”.
2. User can see personal infos like email and username.
3. Underneath personal infos, the user can see a list of groups that he/she is currently joining on the left side of the page.
4. System provides a list of groups with group name, OTT type, group maintenance period and price.
5. If the user is a group leader, there is a crown icon on the left side of the component.
6. When the user clicks one of the groups, the user is redirected to the “Group detail page” page.
7. On the Right side of the page, there is a calendar which provides the user with next payment infos.

### Story #10<br />

#### Meta Specs:

- Feature: Quit group
- Actor: Those who want to leave group
- Precondition: User is currently joining a group, and is not a group leader.
- Trigger: click “Leave Group” button on “Group detail Page”

#### Scenario:

1. User that is one of group members(not group leader) can see red “Leave Group” button on “Group detail page”
2. When the user clicks the button, a new modal pops up and asks the user to leave the group for sure.
3. If the user clicks “yes”, user can leave the group.
4. if the user clicks “no”, the modal would be just closed.

#### Acceptance Test:

- **Given** that the user that is one of group members(not leader) is on the “group detail page”
- **When** the user clicks on the “leave group” button and clicks “yes” on the modal
- **Then** the user’s info is deleted from the group database, and that group can recruit a new member.

### Story #11<br />

#### Meta Specs:

- Feature: Content recommendation
- Actor: Those who want to get content recommendation
- Precondition: A User is logged in to the service, and in the “My Page” page.

#### Scenario:

1. User clicks a search field in the content tab
2. User types in the title of a movie that he or she likes. titles of the movies in the database which match the input show up under the search field.
3. User clicks the title of a movie that he or she likes. then, the movie poster appears in the first place of the “Favorites” list under the search field.
4. Every time a new movie is added to the “Favorites” list, ML recommendation engine finds movies that the user might like and place them on the “Recommendation” list under the “Favorites” list.

#### Exceptions:

- There is no such movie that matches the user input.

#### Acceptance Test:

- **Given** a string which is a part of the movie title
- **When** the user types in each character
- **Then** the system shows the list of movies which match the user input

- **Given** a list of movies that the user likes.
- **When** a new movie is added to the list
- **Then** the list of recommended movies show on the “Recommendations” list.

## User Interface Requirements<br />

**Interface overview (built with Figma) : [link](https://www.figma.com/proto/p2QpjLgPHn0shFwRTQITSk/소개원실?page-id=0%3A1&node-id=2%3A2&viewport=241%2C48%2C0.06&scaling=min-zoom&starting-point-node-id=2%3A2)**

### Information & Interactions for major views

![UI Specification_1](https://github.com/swsnu/swpp2021-team8/blob/master/UI/Screen%20Shot%202021-10-14%20at%2010.01.18%20PM.png)
![UI Specification_2](https://github.com/swsnu/swpp2021-team8/blob/master/UI/Screen%20Shot%202021-10-14%20at%201.28.47%20PM.png)
![UI Specification_3](https://github.com/swsnu/swpp2021-team8/blob/master/UI/Screen%20Shot%202021-10-14%20at%201.28.56%20PM.png)

### User Flows for major Tasks

- **Story#4** Create a new group
  ![UI Specification_4](https://github.com/swsnu/swpp2021-team8/blob/master/UI/Create%20Group.png)
- **Story#5** Edit a group
  ![UI Specification_5](https://github.com/swsnu/swpp2021-team8/blob/master/UI/Edit%20Group.png)
- **Story#8** Join a group
  ![UI Specification_6](https://github.com/swsnu/swpp2021-team8/blob/master/UI/Join%20Group.png)
- **Story#10** Quit my group
  ![UI Specification_7](https://github.com/swsnu/swpp2021-team8/blob/master/UI/Quit%20Group.png)
- **Story#11** Get contents recommendation
  ![UI Specification_8](https://github.com/swsnu/swpp2021-team8/blob/master/UI/Get%20contents%20recommendation.png)
