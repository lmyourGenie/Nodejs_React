import React, { useEffect, useState } from 'react'
import { API_URL, API_KEY, IMAGE_BASE_URL } from '../../Config';
import MainImage from '../LandingPage/Sections/MainImage'
import MovieInfo from './Sections/MovieInfo'
import GridCards from '../commons/GridCards';
import { Row } from 'antd';
import Favorite from './Sections/Favorite';

function MovieDetail(props) {
    let movieId = props.match.params.movieId
    const [Movie, setMovie] = useState([])

    const [Casts, setCasts] = useState([])

    const [ActorToggle, setActorToggle] = useState(false)


    //useEffect는 앱이 실행되자마자 해야할 것을 적는곳
    useEffect(() => {
        
        let endpointCrew = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`
        let endpointInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}`


        fetch(endpointInfo)
            .then(response => response.json())
            .then(response => {
                setMovie(response)
                //response를 Movie라는 State에 저장
            })


        fetch(endpointCrew)
            .then(response => response.json())
            .then(response => {
                setCasts(response.cast)
                //response중 cast정보만을 Casts라는 State에 저장
            })


    }, [])

    const toggleActorView = () => {
        setActorToggle(!ActorToggle)
    }


    return (
        <div>
        {/* Header */}

        <MainImage 
            image={`${IMAGE_BASE_URL}w1280${Movie.backdrop_path}`}
            title={Movie.original_title}
            text={Movie.overview}        
        />

        {/* Body */}
        <div style={{ width: '85%', margin: '1rem auto' }}>

            <div style={{ display:'flex', justifyContent: 'flex-end' }}>
                <Favorite movieInfo={Movie} movieId={movieId} userId={localStorage.getItem('userId')} />
            </div>

            {/* Movie Info */}

            <MovieInfo 
                movie={Movie}
            />


            <br />

            {/* Actors Grid */}

            <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                <button onClick={toggleActorView}> Toggle Actor View </button>
            </div>

            {ActorToggle &&
                <Row gutter={[16, 16]}>

                    {Casts && Casts.map((cast, index) => (
                    /*key를 넣어야 에러가 안남*/
                        <React.Fragment key={index}>

                            <GridCards
                                image={cast.profile_path ?
                                    `${IMAGE_BASE_URL}w500${cast.profile_path}` : null}

                                characterName={cast.name} //이런건 console에서 json 파일이 어떻게 읽히냐에 따라 작성해야함
                            />
                        </React.Fragment>
                    ))}

                </Row>
            }
 
        </div>
        
        </div>    
    )
}

export default MovieDetail
