import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import { API_KEY, API_URL, IMAGE_BASE_URL } from '../../Config';
import MainImage from './Sections/MainImage';

function LandingPage() {

    const [Movies, setMovies] = useState([])
    const [MainMovieImage, setMainMovieImage] = useState(null)

    useEffect(() => {
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

        fetch(endpoint)
        .then(response => response.json())
        .then(response => {
            setMovies([response.results])
            setMainMovieImage(response.results[0]) //첫 번째 영화가 메인이미지로
        })
    } , [])





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

            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button> Load More </button>
            </div>
        </div>
    )
}

export default LandingPage
