import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'moviesdb'
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const connection = await mysql.createConnection(connectionString)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?;', [lowerCaseGenre] // Esto es para evitar SQL inyection
      )

      // no genre found
      if (genres.length === 0) return []

      // get the id from the first genre result
      const [{ id }] = genres

      // get all movies ids from database table
      // la query a movie_genres
      // join
      // y devolver resultados ...
      // TAREA :)
      const [movie_genres] = await connection.query(
        `SELECT LOWER(HEX(movies.id)) AS id, title, year, director, duration, poster, rate
         FROM movies
         INNER JOIN movie_genres ON movies.id = movie_genres.movie_id
         WHERE movie_genres.genre_id = ?;`, [id]
      )

      console.log(movie_genres)
      return [movie_genres] // pa que no pete
    }

    const [movies] = await connection.query(
      'SELECT HEX(id) AS id, title, year, director, duration, poster, rate FROM movies;'
    )

    return movies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query(
      `SELECT LOWER(HEX(id)) AS id, title, year, director, duration, poster, rate
       FROM movies
       WHERE HEX(id) = ?;`, id
    )
    if(movies.length === 0) return []
    return [movies]
  }

  static async create ({ input }) {
    const {
      genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    // Hay que hacer lo de los generos
    // Acabar, pasa que en el genreInput hay dos valores
    const [genreInsertResult] = await connection.query(
      `SELECT id FROM genre WHERE name IN (?);`, [genreInput]
    )
    
    // insert movie
    // creando la id porque si no no se puede recuperar al crear la pelicula
    const [uuidResult] = await connection.query('SELECT UUID() uuid;');
    const [{ uuid }] = uuidResult;

    try {
      await connection.query(
        `INSERT INTO movies (id, title, year, director, duration, poster, rate)
          VALUES (UNHEX(REPLACE("${uuid}", '-', '')), ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate]
      );
    } catch (error) {
      throw new Error('Error creating movie');
    } 
    
    let movieGenreArray = []
    genreInsertResult.forEach(element => {
      let value = {
        movie_id: uuid,
        genre_id: element.id
      };
      movieGenreArray.push(value)
    })

    try {
      await movieGenreArray.forEach(element => {
        connection.query(
          `INSERT INTO movie_genres (movie_id, genre_id)
            VALUES(UNHEX(REPLACE(?, '-', '')),?);`, 
          [element.movie_id, element.genre_id]
        )
      })
    } catch (error) {
      console.error('Error creating movie_genre', error)
    }

    // obtener la película recién insertada usando el UUID generado por la base de datos
    const [movie] = await connection.query(
      `SELECT LOWER(HEX(id)) AS id, title, year, director, duration, poster, rate
        FROM movies
        WHERE id = UNHEX(REPLACE("${uuid}", '-', ''));`
    );

    return movie;
  }

  static async delete ({ id }) {
    try {
      await connection.query(
        `DELETE FROM movies WHERE id = UNHEX(REPLACE(?, '-', ''));`, [id]
      )
    } catch (error) {
      throw new Error('Error deleting movie');
    }
  }

  static async update ({ id, input }) {
    // ejercicio update
    const [movieIndex] = await connection.query(
      `SELECT HEX(id) AS id FROM movies WHERE HEX(id) = ?`, [id]
    )

    if(movieIndex.length === 0) return []

    try {
      await connection.query(
        `UPDATE movies SET ? WHERE HEX(id) = ?`, [input, id]
      )
    } catch (error) {
      console.error('Error updating movies', error)
    }

    const [movie] = await connection.query(
      `SELECT HEX(id), title, year, director, duration, poster, rate
        FROM movies
        WHERE HEX(id) = ?`, [id]
    )

    return movie
  }
}

// Cerrar la conexión cuando hayas terminado
// connection.end();
