import React, { useEffect } from 'react';
import Header from '../components/home/Header';
import Section from '../components/home/Section';
import Footer from '../components/home/Footer';

const Home = () =>{
    useEffect(()=>{
        document.title = "나지미히로의 개인공간"
    })
    return(
        <div>
            <Header/>
            <Section/>
            <Footer/>
        </div>
    );
}

export default Home;