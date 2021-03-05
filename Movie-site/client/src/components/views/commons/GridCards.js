import React from 'react';
import { Col } from 'antd';

function GridCards(props) {

    if(props.landingPage){
        return (
            //한 컬럼에 24사이즈
            //props으로 받아온 정보들을 그리드카드에 넣어줌
            <Col lg={6} md={8} xs={24}>
                <div style={{ position: 'relative' }}>
                    <a href={`/movie/${props.movieId}`} >
                        <img style={{ width:'100%', height:'320px' }} src={props.image} alt={props.movieName} />
                    </a>
                </div>
            </Col>
        )
    } else {
        return (
            <Col lg={6} md={8} xs={24}>
                    <div style={{ position: 'relative' }}>
                        
                        <img style={{ width:'100%', height:'320px' }} src={props.image} alt={props.characterName} />
                        
                    </div>
            </Col>
        )
    }
    
}

export default GridCards
