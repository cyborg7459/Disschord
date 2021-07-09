import React from 'react';
import { Row, Col } from 'react-bootstrap';

import './startup-page.scss';
import coverImg from '../../gallery/cover.png';

class StartupPage extends React.Component {
    render() {
        return (
            <div id='startup-page' className="page-container">
                <div className="page-inner">
                    <Row>
                        <Col lg={6}>
                            <img id='cover-img' src={coverImg}></img>
                        </Col>
                        <Col id='text-col' lg={6}>
                            <div id="main-title">
                                DissChord | A place to share 
                            </div>
                            <div id="description">
                                Join communities you like. View and share posts, join discussions on your favorite topics, and much more !!! 
                            </div>
                            <div id='get-started-btn'> Get started</div>
                        </Col>
                    </Row>
                    
                </div>
                <div class="custom-shape-divider-bottom-1625865561">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" class="shape-fill"></path>
                    </svg>
                </div>
            </div>
        )
    }
}

export default StartupPage;