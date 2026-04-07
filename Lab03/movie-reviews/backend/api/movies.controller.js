import MovieDAO from "../dao/movieDAO.js";

export default class MoviesController {
  static async apiGetMovies(req, res, next) {
    const moviesPerPage = req.query.moviesPerPage ? parseInt(req.query.moviesPerPage) : 20;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    const filters = {};

    if (req.query.rated) {
      filters.rated = req.query.rated;
    }

    else if (req.query.title) {
      filters.title = req.query.title;
    }

    const { moviesList, totalNumMovies } = await MovieDAO.getMovies({
      filters,
      page,
      moviesPerPage,
    });

    let response = {
      movies: moviesList,
      page: page,
      filters: filters,
      entries_per_page: moviesPerPage,
      total_results: totalNumMovies,
    };
    res.json(response);
  }

  static async apiGetMovieById(req, res, next) {
    try {
      let id = req.params.id;
      let movie = await MovieDAO.getMovieById(id);
      if (!movie) {
        res.status(404).json({ error: "Not found" });
      }
      res.json(movie);
    }
    catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetRatings(req, res, next) {
    try {
      let ratings = await MovieDAO.getRatings();
      res.json(ratings);
    }
    catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}