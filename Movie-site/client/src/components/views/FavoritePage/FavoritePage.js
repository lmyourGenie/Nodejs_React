import React, { useEffect, useState } from 'react'
import './favorite.css';
import Axios from 'axios';
import { Popover } from 'antd';
import { IMAGE_BASE_URL } from '../../Config';

function FavoritePage() {
    //DB에서 가져온 정보를 state에 저장하기 위해서
    const [Favorites, setFavorites] = useState([])

    //mongoDB에서 정보 가져오자
    useEffect(() => {

        fetchFavoritedMovie()
       //페이지 들어오자마자 한 번 실행
    }, [])


    const fetchFavoritedMovie = () => {
        Axios.post('/api/favorite/getFavoritedMovie', { userFrom: localStorage.getItem('userId') })
            .then(response => {
                if (response.data.success) {
                    setFavorites(response.data.favorites)
                    //State에 저장
                } else {
                    alert('영화 정보를 가져오는데 실패 했습니다.')
                }
            })
    }



    const onClickDelete = (movieId, userFrom) => {

        const variables = {
            movieId,
            userFrom
        }

        Axios.post('/api/favorite/removeFromFavorite', variables)
            .then(response => {
                if (response.data.success) {
                    fetchFavoritedMovie()
                } else {
                    alert("리스트에서 지우는데 실패했습니다.")
                }
            })


    }


    const renderCards = Favorites.map((favorite, index) => {
        //마우스를 가져다 대면 영화 이미지(=content)를 보여줌
        const content = (
            <div>
                {favorite.moviePost ?

                    <img src={`${IMAGE_BASE_URL}w500${favorite.moviePost}`} /> : "no image"}

                
            </div>
        )


        return <tr key={index}>

            <Popover content={content} title={`${favorite.movieTitle}`} >
                <td>{favorite.movieTitle}</td>
            </Popover>

            <td>{favorite.movieRunTime} mins</td>
            <td><button onClick={() => onClickDelete(favorite.movieId, favorite.userFrom)}>Remove</button></td>

        </tr>
    })



    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h2> Favorite Movies </h2>
            <hr />

            <table>
                <thead>
                    <tr>
                        <th>Movie Title</th>
                        <th>Movie RunTime</th>
                        <td>Remove from favorites</td>
                    </tr>
                </thead>
                <tbody>


                    {renderCards}


                </tbody>
            </table>
        </div>
    )
}

export default FavoritePage