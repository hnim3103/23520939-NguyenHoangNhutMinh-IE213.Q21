import React, { useState, useEffect } from 'react';
import MovieDataService from '../services/movies';
import { Link, useParams } from 'react-router-dom';
import { Card, Col, Row, Container, Button } from 'react-bootstrap';
import moment from 'moment';

function Movie({ user }) {
  const [movie, setMovie] = useState({
    id: null,
    title: "",
    rated: "",
    reviews: []
  });

  const { id } = useParams();

  useEffect(() => {
    getMovie(id);
  }, [id]);

  const getMovie = (id) => {
    MovieDataService.get(id)
      .then(response => {
        setMovie(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteReview = (reviewId, index) => {
    MovieDataService.deleteReview(reviewId, user.id)
      .then(response => {
        setMovie(prev => {
          const updatedReviews = [...prev.reviews];
          updatedReviews.splice(index, 1);
          return { ...prev, reviews: updatedReviews };
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      <Container>
        <Row>
          <Col md={5}>
            <img
              src={movie.poster}
              alt={movie.title}
              style={{ width: '100%' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
              }}
            />
          </Col>
          <Col md={7}>
            <Card>
              <Card.Header as="h5">{movie.title}</Card.Header>
              <Card.Body>
                <Card.Text>{movie.plot}</Card.Text>
              </Card.Body>
            </Card>

            <h3 className="mt-4">Reviews</h3>

            {user && (
              <Link to={`/movies/${id}/review`} state={{ currentUser: user, movie }}>
                <Button variant="primary" className="mb-3">Add Review</Button>
              </Link>
            )}

            {movie.reviews && movie.reviews.length > 0 ? (
              movie.reviews.map((review, index) => (
                <Card key={index} className="mb-2">
                  <Card.Body>
                    <Card.Title>{review.name}</Card.Title>
                    <Card.Text>{review.review}</Card.Text>
                    <Card.Text>
                      <small className="text-muted">
                        {review.date
                          ? moment(review.date).format("Do MMMM YYYY")
                          : ''}
                      </small>
                    </Card.Text>
                    {user && user.id === review.user_id && (
                      <div>
                        <Link
                          to={`/movies/${id}/review`}
                          state={{ currentUser: user, movie, currentReview: review }}
                        >
                          <Button variant="warning" size="sm" className="me-2">Edit</Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteReview(review._id, index)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Movie;
