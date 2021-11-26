"""
Recommendation System based on OVERVIEW only

Top 10 similar movies to The Dark Knight Rises are:

Batman Forever
Batman Returns
Batman
Batman: The Dark Knight Returns, Part 2
Batman Begins
Slow Burn
Batman v Superman: Dawn of Justice
JFK
Batman & Robin
Law Abiding Citizen
"""
# MODIFY THIS AS YOU PLEASE
movie_user_likes = "Harry Potter and the Order of the Phoenix"


import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel, cosine_similarity
from ast import literal_eval
from sklearn.feature_extraction.text import CountVectorizer

df = pd.read_csv('movie_dataset.csv')

# based on description (= column 'overview') to find movie similarity
# Remove all english stop words such as 'the', 'a', ...
tfidf = TfidfVectorizer(stop_words='english')

# Replace NaN with an empty string
df['overview'] = df['overview'].fillna('')

# Construct the required TF(Term Frequency)-IDF matrix by fitting and transforming data
tfidf_matrix = tfidf.fit_transform(df['overview'])

# Output the shape of tfidf_matrix
#tfidf_matrix.shape : (4803, 20978) => 4803 movies, 20978 words

# Compute the cosine similarity matrix
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

"""
def get_recommendations(title, cosine_sim = cosine_sim):
    idx = indices[title]
    sim_scores = list(enumerate(cosine_sim[idx]))

    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    sim_scores = sim_scores[1:11]
    movie_indices = [i[0] for i in sim_scores]

    return df['title'].iloc[movie_indices]

print(get_recommendations('The Dark Knight Rises'))
"""

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
similar_movies = list(enumerate(cosine_sim[movie_index])) 

sorted_similar_movies = sorted(similar_movies,key=lambda x:x[1],reverse=True)[1:]
sorted_similar_movies = sorted_similar_movies[1:11]

print("Top 10 similar movies to "+movie_user_likes+" are:\n")
for element in sorted_similar_movies:
    print(get_title_from_index(element[0]))
    print(get_keywords_from_index(element[0]))
    print(get_cast_from_index(element[0]))
    print(get_genres_from_index(element[0]))
    print(get_director_from_index(element[0]))