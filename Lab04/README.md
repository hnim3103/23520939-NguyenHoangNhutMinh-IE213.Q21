# Lab 04
## Bài 1: Thiết lập nơi làm việc với frontend của dự án.
### 1.1 Tạo template frontend với React trong thư mục Movie Review (ứng dụng minh hoạ).

Để thực hiện yêu cầu trên ta thực hiện:
```JavaScript
    cd movie-reviews
    npx create-react-app frontend
```
Để kiểm tra ta thực hiện:
```JavaScript
    cd frontend
    npm start
```
Thông báo thành công, frontend đang chạy trên port 3000:

![alt text](/Images/image.png)

Giao diện trang web:

![alt text](/Images/image-1.png)

### 1.2 Cài đặt một số package hỗ trợ xây dựng dự án:
- Bootstrap: hỗ trợ xây dựng UI.
- React router dom: hỗ trợ định tuyến.

Để cài đặt các package trên ta thực hiện:
```JavaScript
    npm install boostrap react-router-dom
```
Thông báo thành công:

![alt text](/Images/image-2.png)

## Bài 2: Xây dựng Navigation Header bar cho ứng dụng.
### 2.1 Navigation bar sẽ giúp người dùng định tuyến tới các nội dung của ứng dụng, do đó ta cần xây dựng các component như:
- movies-list: hiển thị thông tin danh sách phim.
- movie: hiển thị phim với các review.
- add-review: hỗ trợ thêm review cho khách.
- login: trang đăng nhập cho khách.

Lưu ý: các component này sẽ được tạo trong thư mục components (được tạo trong thư mục frontend), và lần lượt import vào tệp tin App.js để sử dụng về sau.

Tạo folder components để chứa các components theo yêu cầu:

![alt text](/Images/image-3.png)

### 2.2 Lấy Navbar Component từ React-Bootstrap và đưa vào trong phần mã nguồn JSX của function App() trong tệp tin App.js.

Ta truy cập vào đường dẫn https://getbootstrap.com/docs/5.0/components/navbar/ để lấy Navbar Component.

```JavaScript
function App() {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Link</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
            </li>
          </ul>
          <form class="d-flex">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
}
```
Navbar Component:

![alt text](/Images/image-4.png)

### 2.3 Điều chỉnh một số thông tin:
- Tên logo: Movie Reviews.
- Liên kết thứ nhất thay Home thành Movies.
- Liên kết thứ hai thay Link thành trạng thái Login/Logout của người dùng.

```JavaScript
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container } from 'react-bootstrap';

import AddReview from './components/add-review';
import Movie from './components/movie';
import MoviesList from './components/movies-list';
import Login from './components/login';

import './App.css';

function App() {
  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null);
  }

  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#home">Movie Reviews</a>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <Link to={"/movies"} className="nav-link">Movies</Link>
            </li>
            <li class="nav-item">
              {user ? (
                <a onClick={logout} href="#" className="nav-link">Logout User</a>
              ) : (
                <Link to={"/login"} className="nav-link">Login</Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default App;
``` 

Kết quả:

![alt text](/Images/image-5.png)

## Bài 3: Thiết lập các định tuyến cho các component vừa tạo ở trên.
### 3.1 Trong tệp tin App.js cần sử dụng thẻ <Switch> hoặc <Routes> (import từ react-router-dom) để định tuyến cho 4 component tạo ở bài 2.1.
### 3.2 Các định tuyến bao gồm:
- “/”: đến component MoviesList.
- “/movies/:id/review”: đến component AddReview.
- “/movies/:id”: đến component Movie.
- “/login”: đến component Login.

```JavaScript
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container } from 'react-bootstrap';

import AddReview from './components/add-review';
import Movie from './components/movie';
import MoviesList from './components/movies-list';
import Login from './components/login';

import './App.css';

function App() {
  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null);
  }

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Movie Reviews</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
              {user ? (
                <Nav.Link onClick={logout} style={{ cursor: 'pointer' }}>Logout User</Nav.Link>
              ) : (
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-3">
        <Routes>
          <Route path="/" element={<MoviesList />} />
          <Route path="/movies" element={<MoviesList />} />
          <Route path="/movies/:id/review" element={<AddReview user={user} />} />
          <Route path="/movies/:id" element={<Movie user={user} />} />
          <Route path="/login" element={<Login login={login} />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
```

```JavaScript
// components/movies-list.js
import React from 'react'

function MoviesList() {
  return (
    <div className="App">
      Movies List
    </div>
  );
}
export default MoviesList;

// components/movie.js
import React from 'react'

function Movie() {
  return (
    <div className="App">
      Movie Details
    </div>
  );
}
export default Movie;

// components/add-review.js
import React from 'react'

function AddReview() {
  return (
    <div className="App">
      Add Review
    </div>
  );
}
export default AddReview;

// components/login.js
import React from 'react'

function Login() {
  return (
    <div className="App">
      Login Page
    </div>
  );
}
export default Login;
```
