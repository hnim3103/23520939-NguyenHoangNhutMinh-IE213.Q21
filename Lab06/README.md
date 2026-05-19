# Lab 06
## Bài 1: Thêm và Sửa Review.
### 1.1 Tạo login component.

Yêu cầu khi thiết lập login component thì khi người dùng đăng nhập thành công, họ sẽ thấy được các chức năng như Edit và Delete review của chính họ.

Sau khi login thành công, người dùng sẽ được redirect về lại trang Home.

Ở đây vì để tiện cho việc làm lab, thay vì sử dụng password, ta sẽ sử dụng id để đăng nhập, dễ kiểm soát id và name cho từng người.

```JavaScript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Login = props => {
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const navigate = useNavigate();

    const onChangeName = e => {
        const name = e.target.value;
        setName(name);
    }

    const onChangeId = e => {
        const id = e.target.value;
        setId(id);
    }

    const login = () => {
        props.login({ name: name, id: id });
        navigate('/');
    }

    return (
        <div>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={name}
                        onChange={onChangeName}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter id"
                        value={id}
                        onChange={onChangeId}
                    />
                </Form.Group>
                <Button variant="primary" onClick={login}>
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default Login;
```

### 1.2 Thêm Review

Tạo các biến như hướng dẫn sau:

- Biến editing sẽ có giá trị true khi component đang ở chế độ Editing.
- Ngược lại là chế độ thêm review.
- Biến trạng thái review được thiết lập thông qua biến initialReviewState.
- Trong chế độ editing, initialReviewState sẽ được thiết lập có nội dung text.
- Biến trạng thái submitted để theo dấu nếu như có một review được thêm mới.
Tạo các hàm phù hợp:
- Hàm onChangeReview() theo vết khi người dùng thêm giá trị review dưới form.
- Hàm saveReview() được gọi khi nút submit được nhấn.
Trong hàm này, đầu tiên ta tạo một object tên data chứa các giá trị thuộc tính của review.
- 2 giá trị name và user_id sẽ nhận từ props được gửi từ App.js.
- Lấy movie_id trực tiếp từ url (xem lại nội dung movie.js).
- Sau đó gọi hàm createReview(data) trong MovieDataServiece.
- Định tuyến này gọi tới ReviewsController trong backend và gọi apiPostReview(), trích xuất data từ request’s body params
Phần return() chứa nội dung JSX giúp hiển thị và xử lý tính năng thêm review:

```JavaScript
import React, { useState } from 'react';
import MovieDataService from '../services/movies';
import { Link, useParams, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AddReview = props => {
    const { id } = useParams(); // Lấy movie_id từ url
    let initialReviewState = "";
    let editing = false;

    const [review, setReview] = useState(initialReviewState);
    const [submitted, setSubmitted] = useState(false);

    const onChangeReview = e => {
        setReview(e.target.value);
    }

    const saveReview = () => {
        var data = {
            review: review,
            name: props.user.name,
            user_id: props.user.id,
            movie_id: id 
        };

        MovieDataService.createReview(data)
            .then(response => {
                setSubmitted(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    return (
        <div>
            {submitted ? (
                <div>
                    <h4>Review submitted successfully!</h4>
                    <Link to={"/movies/" + id}>
                        Back to Movie
                    </Link>
                </div>
            ) : (
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>{editing ? "Edit Review" : "Create Review"}</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            value={review}
                            onChange={onChangeReview}
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={saveReview}>
                        Submit
                    </Button>
                </Form>
            )}
        </div>
    );
}

export default AddReview;
```

### 1.3 Sửa Review

Viết mã nguồn thực hiện các việc sau:
- Đầu tiên, kiểm tra trạng thái truyền vào cho AddReview (xem lại tệp tin movie.js sẽ thấy prop
state).
- Nếu state được truyền vào chứa thuộc tính currentReview thì chuyển editing thành true và
initialReviewState thành currentReview.review.
- Nếu editing là true thì gọi updateReview() trong MovieDataService.
- Phương thức apiUpdateReview() trong ReviewsController ở backend sẽ được gọi, tương tự
apiPostReview.
Chạy ứng dụng sẽ cho phép cập nhật lại review

```JavaScript
// Cập nhật lại phần khởi tạo biến và hàm saveReview trong file add-review.js
const location = useLocation();

if (location.state && location.state.currentReview) {
    editing = true;
    initialReviewState = location.state.currentReview.review;
}

const [review, setReview] = useState(initialReviewState);
const [submitted, setSubmitted] = useState(false);

const saveReview = () => {
    var data = {
        review: review,
        name: props.user.name,
        user_id: props.user.id,
        movie_id: id 
    };

    if (editing) {
        data.review_id = location.state.currentReview._id;
        MovieDataService.updateReview(data)
            .then(response => {
                setSubmitted(true);
            })
            .catch(e => {
                console.log(e);
            });
    } else {
        MovieDataService.createReview(data)
            .then(response => {
                setSubmitted(true);
            })
            .catch(e => {
                console.log(e);
            });
    }
}
```

## Bài 2: Xóa review

- Trong nút delete, ta truyền review id và index chúng ta nhận được từ movie.reviews.map()
vào phương thức deleteReview().
- Trong phương thức deleteReview(), ta gọi hàm deleteReview() trong MovieDataService.
- Sau đó, tạo một callback .then() sẽ được gọi sau khi deleteReview() được gọi xong.
- Trong callback này, ta lấy mảng các reviews trong trạng thái hiện tại. Sau đó cung cấp index
của review sẽ bị xoá cho phương thức splice() để xoá nó đi.
- Cuối cùng là cập nhật lại mảng reviews như là trạng thái mới.
Chạy lại ứng dụng -> log in -> chọn một movie cụ thể có review mà mình đã đăng.

```JavaScript
// Thêm hàm deleteReview vào trong component Movie (file movie.js)
const deleteReview = (reviewId, index) => {
    MovieDataService.deleteReview(reviewId, props.user.id)
        .then(response => {
            setMovie((prevState) => {
                prevState.reviews.splice(index, 1);
                return {
                    ...prevState
                };
            });
        })
        .catch(e => {
            console.log(e);
        });
}

// Cập nhật lại JSX cho nút Delete (trong movie.reviews.map())
<Button
    variant="danger"
    size="sm"
    onClick={() => deleteReview(review._id, index)}
>
    Delete
</Button>
```

## Bài 3: Lấy dữ liệu cho trang tiếp theo
### 3.1 getAll()

Trong component movies-list.js thêm mã nguồn để thực hiện yêu cầu.
- Thêm 2 biến trạng thái currentPage và entriesPerPage.
- Thiết lập 2 biến trạng thái này trong phương thức retrieveMovies().
- Thêm một useEffect hook:

```JavaScript
useEffect(() => {
    retrieveMovies();
}, [currentPage]);
```
- Biến trạng thái currentPage được truyền trong tham số thứ 2 (trong mảng) nhằm mục
đích khi giá trị của nó thay đổi thì hàm retrieveMovies() sẽ được gọi.
- Quan trọng: nhớ truyền currentPage vào lời gọi MovieDataService.get().
- Đồng thời, thêm đoạn mã xử lý vào hàm return().

```JavaScript
// Trong file movies-list.js
const [currentPage, setCurrentPage] = useState(0);
const [entriesPerPage, setEntriesPerPage] = useState(0);

const retrieveMovies = () => {
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

// Thêm đoạn mã xử lý hiển thị phân trang vào cuối hàm return()
return (
    <div className="App">
        {/* Các đoạn mã hiện có */}
        
        {/* Phân trang */}
        <Row className="mt-3">
            <Col>
                Showing page: {currentPage}
            </Col>
            <Col>
                <Button 
                    variant="link" 
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Get next {entriesPerPage} results
                </Button>
            </Col>
        </Row>
    </div>
);
```

### 3.2 find()

Trong movies-list.js ta điều chỉnh mã nguồn theo các yêu cầu sau:
- Đầu tiên, tạo biến trạng thái currentSearchMode để nhận 2 giá trị “findByTitle” hoặc
“findByRating”.
- Sử dụng một useEffect() để khi nào currentSearchMode thay đổi thì thiết lập lại
currentPage về 0.
- Tạo phương thức mới retrieveNextPage() -> dựa vào currentSearchMode để gọi các
hàm tương ứng.
- Thêm tham số currentPage vào trong lời gọi MovieDataService.find().
- Lần lượt thêm các dòng mã lệnh setCurrentSearchMode() tương ứng vào 3 phương
thức điều khiển:
    - retrieveMovies();
    - findByTitle();
    - findByRating();

```JavaScript
// 1. Tạo biến trạng thái currentSearchMode
const [currentSearchMode, setCurrentSearchMode] = useState("");

// 2. Sử dụng useEffect khi currentSearchMode thay đổi
useEffect(() => {
    setCurrentPage(0);
}, [currentSearchMode]);

// 3. Sử dụng useEffect thay thế để gọi lại hàm khi chuyển trang
useEffect(() => {
    retrieveNextPage();
}, [currentPage]);

const retrieveNextPage = () => {
    if (currentSearchMode === "findByTitle") {
        findByTitle();
    } else if (currentSearchMode === "findByRating") {
        findByRating();
    } else {
        retrieveMovies();
    }
};

// 4. Cập nhật các hàm có chứa setCurrentSearchMode và currentPage
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

const findByTitle = () => {
    setCurrentSearchMode("findByTitle");
    MovieDataService.find(searchTitle, "title", currentPage)
        .then(response => {
            setMovies(response.data.movies);
        })
        .catch(e => {
            console.log(e);
        });
};

const findByRating = () => {
    setCurrentSearchMode("findByRating");
    if (searchRating === "All Ratings") {
        retrieveMovies();
    } else {
        MovieDataService.find(searchRating, "rated", currentPage)
            .then(response => {
                setMovies(response.data.movies);
            })
            .catch(e => {
                console.log(e);
            });
    }
};
```
