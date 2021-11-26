"""
Recommendation System based on 4 FEATURES DIFFERENTLY
GENRES 30
KEYWORDS 30
DIRECTOR 20
CAST 20

Top 10 similar movies to The Dark Knight Rises are:

Batman Begins
The Prestige
The Killer Inside Me
The Way of the Gun
Hitman
Jack Reacher
Insomnia
Kick-Ass
Inception
Interstellar
"""
# MODIFY THESE AS YOU PLEASE
movie_user_likes = "Titanic"
genre_percentage = 0.3
keywords_percentage = 0.3
director_percentage = 0.2
cast_percentage = 0.2

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

df = pd.read_csv("movie_dataset.csv")

features = ['keywords','cast','genres','director']

for feature in features:
    df[feature] = df[feature].fillna('') #filling all NaNs with blank string

cv = CountVectorizer() #creating new CountVectorizer() object
count_matrix_keywords = cv.fit_transform(df["keywords"]) #feeding combined strings(movie contents) to CountVectorizer() object
count_matrix_cast = cv.fit_transform(df["cast"]) #feeding combined strings(movie contents) to CountVectorizer() object
count_matrix_genres = cv.fit_transform(df["genres"]) #feeding combined strings(movie contents) to CountVectorizer() object
count_matrix_director = cv.fit_transform(df["director"]) #feeding combined strings(movie contents) to CountVectorizer() object

cosine_sim_keywords = cosine_similarity(count_matrix_keywords)
cosine_sim_cast = cosine_similarity(count_matrix_cast)
cosine_sim_genres = cosine_similarity(count_matrix_genres)
cosine_sim_director = cosine_similarity(count_matrix_director)

matrix_keywords = np.matrix(cosine_sim_keywords)
matrix_cast = np.matrix(cosine_sim_cast)
matrix_genres = np.matrix(cosine_sim_genres)
matrix_director = np.matrix(cosine_sim_director)

final_matrix = matrix_keywords*keywords_percentage + matrix_cast*cast_percentage + matrix_genres*genre_percentage + matrix_director*director_percentage

final_series = pd.DataFrame(np.array(final_matrix)).stack()

def get_index_from_title(title):
    return df[df.title == title]["index"].values[0]

def get_title_from_index(index):
    return df[df.index == index]["title"].values[0]
def get_genres_from_index(index):
    return df[df.index == index]["genres"].values
def get_director_from_index(index):
    return df[df.index == index]["director"].values
def get_cast_from_index(index):
    return df[df.index == index]["cast"].values
def get_keywords_from_index(index):
    return df[df.index == index]["keywords"].values

movie_index = get_index_from_title(movie_user_likes)
#accessing the row corresponding to given movie to find all the similarity scores for that movie and then enumerating over it
similar_movies = list(enumerate(final_series[movie_index])) 

sorted_similar_movies = sorted(similar_movies,key=lambda x:x[1],reverse=True)[1:]
sorted_similar_movies = sorted_similar_movies[1:11]


print("Top 10 similar movies to "+movie_user_likes+" are:\n")
for element in sorted_similar_movies:
    print(get_title_from_index(element[0]))
    print(get_keywords_from_index(element[0]))
    print(get_cast_from_index(element[0]))
    print(get_genres_from_index(element[0]))
    print(get_director_from_index(element[0]))