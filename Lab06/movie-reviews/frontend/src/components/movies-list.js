import React, { useState, useEffect } from 'react';
import MovieDataService from '../services/movies';
import { Link } from 'react-router-dom';
import { Card, Button, Col, Row, Container, Form } from 'react-bootstrap';

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchRating, setSearchRating] = useState('');
  const [ratings, setRatings] = useState(['All Ratings']);

  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(0);
  const [currentSearchMode, setCurrentSearchMode] = useState("");

  useEffect(() => {
    setCurrentPage(0);
  }, [currentSearchMode]);

  useEffect(() => {
    retrieveNextPage();
  }, [currentPage]);

  useEffect(() => {
    retrieveRatings();
  }, []);

  const retrieveNextPage = () => {
    if (currentSearchMode === "findByTitle") {
      findByTitle();
    } else if (currentSearchMode === "findByRating") {
      findByRating();
    } else {
      retrieveMovies();
    }
  };

  const retrieveMovies = () => {
    setCurrentSearchMode("");
    MovieDataService.getAll(currentPage)
      .then(response => {
        setMovies(response.data.movies);
        setCurrentPage(response.data.page);
        setEntriesPerPage(response.data.entries_per_page);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveRatings = () => {
    MovieDataService.getRatings()
      .then(response => {
        setRatings(['All Ratings', ...response.data]);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const onChangeSearchTitle = e => {
    setSearchTitle(e.target.value);
  };

  const onChangeSearchRating = e => {
    setSearchRating(e.target.value);
  };

  const findByTitle = () => {
    setCurrentSearchMode("findByTitle");
    MovieDataService.find(searchTitle, 'title', currentPage)
      .then(response => {
        setMovies(response.data.movies);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByRating = () => {
    setCurrentSearchMode("findByRating");
    if (searchRating === 'All Ratings') {
      retrieveMovies();
    } else {
      MovieDataService.find(searchRating, 'rated', currentPage)
        .then(response => {
          setMovies(response.data.movies);
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  return (
    <div>
      <Container>
        <Row className="mb-3">
          <Col>
            <Form.Control
              type="text"
              placeholder="Search by title"
              value={searchTitle}
              onChange={onChangeSearchTitle}
            />
            <Button
              variant="primary"
              className="mt-2"
              onClick={findByTitle}
            >
              Search
            </Button>
          </Col>

          <Col>
            <Form.Select
              value={searchRating}
              onChange={onChangeSearchRating}
            >
              {ratings.map((rating, index) => (
                <option key={index} value={rating}>
                  {rating}
                </option>
              ))}
            </Form.Select>
            <Button
              variant="primary"
              className="mt-2"
              onClick={findByRating}
            >
              Search
            </Button>
          </Col>
        </Row>

        <Row xs={1} md={3} className="g-4">
          {movies && movies.map((movie) => (
            <Col key={movie._id}>
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={movie.poster}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/200x300?text=No+Image';
                  }}
                />
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Text>Rating: {movie.rated}</Card.Text>
                  <Card.Text>{movie.plot}</Card.Text>
                  <Link to={`/movies/${movie._id}`}>
                    <Button variant="primary">View Reviews</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <br />
        Showing page: {currentPage}.
        <Button
          variant="link"
          onClick={() => { setCurrentPage(currentPage + 1) }}
        >
          Get next {entriesPerPage} results
        </Button>
      </Container>
    </div>
  );
}

export default MoviesList;
