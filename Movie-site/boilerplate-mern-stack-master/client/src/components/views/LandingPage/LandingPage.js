import React, { useEffect, useState } from 'react'
import { FaCode, FaSortAmountDown } from "react-icons/fa";
import { API_KEY, API_URL, IMAGE_BASE_URL } from '../../Config';
import MainImage from './Sections/MainImage';
import GridCards from '../commons/GridCards';
import { Row } from 'antd';

function LandingPage() {

    const [Movies, setMovies] = useState([])
    const [MainMovieImage, setMainMovieImage] = useState(null)
    const [CurrentPage, setCurrentPage] = useState(0)

    useEffect(() => {
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        //페이지가 1
        //즉, 처음 20개의 영화를 받아서 카드에 담아 보여줌
        fetchMovies(endpoint)
        //앱이 로드되자마자 실행

    } , [])


    const fetchMovies = ( endpoint ) => {
        fetch(endpoint)
        .then(response => response.json())
        .then(response => {
            setMovies([...Movies, ...response.results])
            //setMovies([...response.results])
            //이렇게하면 덮어씌우기 때문에 LoadMore을 누르면 이전 영화 20개가 사라짐
            setMainMovieImage(response.results[0]) //첫 번째 영화가 메인이미지로
            setCurrentPage(response.page)
        })
    }


    const loadMoreItems = () => {
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;
        //loadMore을 누를수록 page 숫자가 올라가므로 동적으로 할당
        fetchMovies(endpoint)
    }





    return (
        <div style={{ width: '100%', margin: 0 }}>
            {/* Main Image */}
            {MainMovieImage && //있으면 아래 실행
                <MainImage 
                    image={`${IMAGE_BASE_URL}w1280${MainMovieImage.backdrop_path}`}
                    title={MainMovieImage.original_title}
                    text={MainMovieImage.overview}
                />            
            }

            <div style={{ width: '85%', margin: '1rem auto' }}>
                <h2>Movies by latest</h2>
                <hr />

                {/* Movie Grid Card */}
                <Row gutter={[16, 16]}>              
                    {Movies && Movies.map((movie, index) => (
                    /*key를 넣어야 에러가 안남*/
                        <React.Fragment key={index}>

                            <GridCards 
                                image={movie.poster_path ?
                                    `${IMAGE_BASE_URL}w500${movie.poster_path}` : null}

                                movieId={movie.id}
                                movieName={movie.original_title}
                            />
                        </React.Fragment>
                    ))}

                </Row>

            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={loadMoreItems}> Load More </button>
            </div>
        </div>
    )
}

export default LandingPage