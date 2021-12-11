"""
Recommendation System based on 4 FEATURES DIFFERENTLY
GENRES 30
KEYWORDS 30
DIRECTOR 20
CAST 10
OVERVIEW 10

"""
# MODIFY THESE AS YOU PLEASE
genre_percentage = 0.4
director_percentage = 0.2
cast_percentage = 0.3
overview_percentage = 0.1

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity, linear_kernel
import _pickle as cPickle

def recommender(data, movie_user_likes):
    df = pd.json_normalize(data)

    cv = CountVectorizer()
    tfidf = TfidfVectorizer(stop_words='english')

    count_matrix_cast = cv.fit_transform(df["cast"])
    count_matrix_genres = cv.fit_transform(df["genres"])
    count_matrix_director = cv.fit_transform(df["director"])
    tfidf_matrix_overview = tfidf.fit_transform(df['overview'])

    cosine_sim_cast = cosine_similarity(count_matrix_cast)
    cosine_sim_genres = cosine_similarity(count_matrix_genres)
    cosine_sim_director = cosine_similarity(count_matrix_director)
    cosine_sim_overview = linear_kernel(tfidf_matrix_overview)

    matrix_cast = np.matrix(cosine_sim_cast)
    matrix_genres = np.matrix(cosine_sim_genres)
    matrix_director = np.matrix(cosine_sim_director)
    matrix_overview = np.matrix(cosine_sim_overview)

    final_matrix = matrix_cast*cast_percentage + matrix_genres*genre_percentage + matrix_director*director_percentage + matrix_overview*overview_percentage

    final_series = pd.DataFrame(np.array(final_matrix)).stack()
    final_series = final_series.rename(lambda x: df[df.index == x]["id"].values[0])

    similar_movies = final_series[movie_user_likes]

    sorted_movies = similar_movies.sort_values(ascending=False)
    sorted_movies = sorted_movies[1:11]

    result = list({"id": movie[0], "poster": df[df.id == movie[0]]["poster"].values[0]} for movie in sorted_movies.items())

    return result

def create_matrix(data):
    df = pd.json_normalize(data)

    cv = CountVectorizer()
    tfidf = TfidfVectorizer(stop_words='english')

    count_matrix_cast = cv.fit_transform(df["cast"])
    count_matrix_genres = cv.fit_transform(df["genres"])
    count_matrix_director = cv.fit_transform(df["director"])
    tfidf_matrix_overview = tfidf.fit_transform(df['overview'])

    cosine_sim_cast = cosine_similarity(count_matrix_cast)
    cosine_sim_genres = cosine_similarity(count_matrix_genres)
    cosine_sim_director = cosine_similarity(count_matrix_director)
    cosine_sim_overview = linear_kernel(tfidf_matrix_overview)

    matrix_cast = np.matrix(cosine_sim_cast)
    matrix_genres = np.matrix(cosine_sim_genres)
    matrix_director = np.matrix(cosine_sim_director)
    matrix_overview = np.matrix(cosine_sim_overview)

    final_matrix = matrix_cast*cast_percentage + matrix_genres*genre_percentage + matrix_director*director_percentage + matrix_overview*overview_percentage

    final_series = pd.DataFrame(np.array(final_matrix)).stack()
    final_series = final_series.rename(lambda x: df[df.index == x]["id"].values[0])

    return cPickle.dumps(final_series)

def get_recommendation(matrix_pickle, movie_user_likes):
    final_matrix = cPickle.loads(matrix_pickle)
    print(final_matrix)
    
    similar_movies = final_matrix[movie_user_likes]

    sorted_movies = similar_movies.sort_values(ascending=False)
    sorted_movies = sorted_movies[1:11]

    result = list({"id": movie[0]} for movie in sorted_movies.items())

    return result