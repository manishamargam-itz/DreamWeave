import React from "react";
import Header from "../components/Header";
import Steps from "../components/Steps";
import Description from "../components/Description";
import Testimonial from "../components/Testimonial";
import GenerateBtn from "../components/GenerateBtn";

const Home = () => {
  return (
    <>
      {/* Page Header */}
      <Header />
      
      {/* Steps Section */}
      <Steps />
      
      {/* Description Section */}
      <Description />
      
      {/* Testimonials Section */}
      <Testimonial />
      
      {/* Generate Button */}
      <GenerateBtn />
    </>
  );
};

export default Home;
