import logo from './logo.svg';
import './App.css';
import baseHoverImg from "./Img/icon.png";
import imgOne from "./Img/Screenshot_1.png";
import imgTwo from "./Img/icarus1.jpg";
import mask from "./Img/SquareMask.png";
import ArtPiece from "./ArtPiece";
import HelpText from "./HelpText";
import ScrollingBanner from "./ScrollingBanner";
import ThreeJS from "./ThreeJS";
import React from 'react';

import ClassJSON from "./Data/class.json"

import paperText1 from "./Img/test-paper-texture.png";
import paperText2 from "./Img/test-paper-texture-2.png";
import paperText3 from "./Img/test-paper-texture-3.png";
import paperText4 from "./Img/test-paper-texture-4.png";
import paperText5 from "./Img/test-paper-texture-5.png";

import axios from 'axios';
//import { Page, Text, View, Document, StyleSheet, ReactPDF } from '@react-pdf/renderer';
//https://medium.com/craftcode-design/how-to-build-a-contact-form-with-react-js-and-php-d5977c17fec0
//<marquee behavior="alternate">Test test test</marquee>
class App extends React.Component {
  constructor(props){
    super(props);

    this.paperTextures = [paperText1, paperText2, paperText3, paperText4, paperText5];
    //this.currPaperTexture = 0;
    this.testHover = this.testHover.bind(this);
    this.clearHover = this.clearHover.bind(this);
    //this.changeCurrentPageIndex = this.changeCurrentPageIndex.bind(this);
    let path = window.location.pathname;
    this.scrollbarRef = React.createRef();
    //this.scrollbarRef.current = 0;

    if(path.toUpperCase().includes("HELP")){
      this.scrollbarRef.current = 3;
    }else{
      this.scrollbarRef.current = 0;
    }

    window.addEventListener('mousemove', (event) => {
      this.setState({
        mouseXWas: this.state.mouseX,
        mouseYWas: this.state.mouseY,
        mouseX: event.clientX,
        mouseY: event.clientY
      });
    });
    
    this.state={
      baseHoverImg: baseHoverImg,
      currHoverImg: null,
      currPaperTexture: 0,
      mouseRelativeXPercent: 0,
      mouseRelativeYPercent: 0,
      
      lastFactX: false,
      mouseX: 0,
      mouseY: 0,
      mouseXWas: 0,
      mouseYWas: 0,
      mathFact: [null, null, null, null],
      indexFilter: {
        digital: false,
        identity: false,
        logo: false,
        print: false,
        poster: false,
        layout: false,
        web: false
      },
      textFilter : ""

    }    

    setInterval(() => {
      this.getFunFact(this.state.lastFactX ? this.state.mouseX : this.state.mouseY);
    }, 500);

/*
    window.addEventListener('click', (event) => {
      this.getFunFact(this.state.lastFactX ? this.state.mouseX : this.state.mouseY);
    });
*/
    setInterval(() => {
      let newCurrPaperTexture = Math.floor(Math.random() * this.paperTextures.length);
      //console.log("newCurrPaperTexture: " + newCurrPaperTexture);
      this.setState((prevState) => {
        return{
          //currPaperTexture: (this.state.currPaperTexture + 1) % this.paperTextures.length
          currPaperTexture: newCurrPaperTexture
        };
      });
    }, 250);   
  }

  async getFunFact(number){
    if(number == this.state.mouseXWas || number == this.state.mouseYWas){
      return;
    }
    const resp = await fetch(`http://numbersapi.com/${number}/year`)
    .then(response => response.text())
    .then(data => {
      //console.log(response.text());
      this.setState({
        mathFact: [data, this.state.mathFact[0], this.state.mathFact[1], this.state.mathFact[2]],
        lastFactX: !this.state.lastFactX,
        mouseXWas: this.state.mouseX,
        mouseYWas: this.state.mouseY,
      });
    })
  }

  testHover(props){
    let threshold = 1; //if difference > threshold, we will modify state
    let e = window.event;

    let posX = e.clientX;
    let posY = e.clientY;

    const textElement = document.getElementById(props.id);
    let textRect = textElement.getBoundingClientRect();
    //console.log(textRect.top, textRect.right, textRect.bottom, textRect.left); //mostly interested in top/left

    let minNormX = textRect.right - textRect.left;
    let cursorNormX = posX - textRect.left;

    let minNormY = textRect.bottom - textRect.top;
    let cursorNormY = posY - textRect.top;

    //console.log(`mouse pos: ${posX} - ${posY}, that means width=${(cursorNormX / minNormX) * 100}%, height=${(cursorNormY / minNormY) * 100}%`);
    //console.log("inner APP hover works: " + JSON.stringify(props));

    let finalCalcX = (cursorNormX / minNormX) * 100;
    let finalCalcY = (cursorNormY / minNormY) * 100;

//was trying to improve performance, defo makes the hover effect look worse, didnt do much to the other elements. 
    ////console.log(`hover test: ${Math.abs(finalCalcX - this.state.mouseRelativeXPercent)} - ${Math.abs(finalCalcY - this.state.mouseRelativeYPercent)}`)

    //if(Math.abs(finalCalcX - this.state.mouseRelativeXPercent) > threshold || Math.abs(finalCalcY - this.state.mouseRelativeYPercent) > threshold){
      this.setState({
        currHoverImg: props.img, 
        mouseRelativeXPercent: finalCalcX,
        mouseRelativeYPercent: finalCalcY
      });
    //}

  }

  clearHover(props){
    //console.log("inner APP hover works: " + JSON.stringify(props));
    this.setState({currHoverImg: null});
  }

  applyIndexFilter(pressedFilter){
    var newIndexFilter = this.state.indexFilter;
    newIndexFilter[pressedFilter] = !newIndexFilter[pressedFilter];
    this.setState({
      indexFilter: newIndexFilter
    });

    console.log("STATE: "  + JSON.stringify(this.state));
    /*
    console.log("PRESSED: " + pressedFilter);
    if(this.state.indexFilter.includes(pressedFilter)){
      this.state.indexFilter = this.state.indexFilter.remo
    }*/
  }

  getListOfWorks(){
    let classHTML = [];
    let currLetter = null;
    let currID = 0;

    ClassJSON.students.forEach(student => {
      if(student.name.toUpperCase().includes(this.state.textFilter.toUpperCase())){
        //console.log("student: " + JSON.stringify(student));
        if(currLetter != student.name[0]){
          if(currLetter != null){
            classHTML.push(<br/>);
          }
          currLetter = student.name[0];
          classHTML.push(<div>{currLetter}</div>);
        }

        classHTML.push(<ArtPiece hoverOverTextFunc={this.testHover} 
          hoverExitTextFunc={this.clearHover} 
          id={currID} 
          img={imgTwo} 
          coreInfo={student}
          currFilter={this.state.indexFilter}
          key={currID}
          />);
      }
      currID++;
    });

    return(
      classHTML
    );
  }

  updateTextFilter(newText){
    console.log("newtext: " + newText);
    this.setState({
      textFilter: newText
    });
  }

  getPage(){
    if(this.scrollbarRef != null){
      switch(this.scrollbarRef.current){
        case 0:
          return(
            <div>
              <div className="content" >
                <div className="left" >
                  <div className="title-container">
                    <span className="header">PRESS</span>
                    <br/><br/>
                    <a className="header">Print Screen</a>
                    <br/><br/>
                    <input className="search-bar" placeholder="Search..." onChange={e => this.updateTextFilter(e.target.value)}>
                    </input>
                  </div>
                  <div className="student-names"> 
                    {this.getListOfWorks()}
                  </div>
                </div>
                
                <div className="right">
                  <div>Filters</div>
                  <br/>
                  <a className="filter digital" 
                  onClick = {(() => this.applyIndexFilter("digital"))}
                  style={{color: this.state.indexFilter["digital"] ? "#840032" : "black"}}>
                    Digital
                  </a>

                  <a className="filter identity" 
                  onClick = {(() => this.applyIndexFilter("identity"))}
                  style={{color: this.state.indexFilter["identity"] ? "#E59500" : "black"}}>
                    Identity
                  </a>

                  <a className="filter logo" 
                  onClick = {(() => this.applyIndexFilter("logo"))}
                  style={{color: this.state.indexFilter["logo"] ? "#002642" : "black"}}>
                    Logo
                  </a>

                  <a className="filter print" 
                  onClick = {(() => this.applyIndexFilter("print"))}
                  style={{color: this.state.indexFilter["print"] ? "#04A777" : "black"}}>
                    Print
                  </a>

                  <a className="filter poster" 
                  onClick = {(() => this.applyIndexFilter("poster"))}
                  style={{color: this.state.indexFilter["poster"] ? "#5398BE" : "black"}}>
                    Poster
                  </a>

                  <a className="filter layout" 
                  onClick = {(() => this.applyIndexFilter("layout"))}
                  style={{color: this.state.indexFilter["layout"] ? "#D4E79E" : "black"}}>
                    Layout
                  </a>

                  <a className="filter web" 
                  onClick = {(() => this.applyIndexFilter("web"))}
                  style={{color: this.state.indexFilter["web"] ? "#EEFC57" : "black"}}>
                    Web
                  </a>

                </div>
              </div>
            </div>
          );
        case 3:
          return(
            <div className="index-main"> 
              <ThreeJS/> 
              <HelpText/>
            </div>
          );
      }
    }

    return(
      <div>uh oh ewwow : ( </div>
    );
  }

  generatePDFHTML(){
    return(
      `<div>1111111111111111<div>
      <img src="%img1%" width="150" height="150"/>
      <div>2222222222222<div>
      `
    );
  }

  pdfTestSave(){
    console.log("test save start");
    
    var pdfHTML = `${this.generatePDFHTML()}`;
    var formData = new FormData();

    formData.append("msg", "deez nuts");
    formData.append("pdf", "na");
    //formData.append("img1Path", imgOne);
    //formData.append("pdf", pdfResponse);
    formData.append("pdfHTML", pdfHTML);
    formData.append("pdfName", `${Math.random() * 10000000} - ${Date.now()}.pdf`);

    /*
    console.log("FORM DATA: ");
    for (const [key, value] of formData) {
      console.log(`   ${key}: ${value}`);
    }*/
    
    axios({
      url: "http://localhost:8000/index.php", 
      method: "POST",
      data: formData,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
    }
    })
    .then(function(response) {
        console.log("outcome 1");
        console.log(response);          
    })
    .then(function(myJson) {
        // use parseed result
        console.log("outcome 2");
        console.log(myJson);
    });

    console.log("test save end");
  }

  render() {
    var maskPosition = `center`
    
    //Whatever is shown when no image is being hovered
    var backgroundStyle = {
      

    }

    if(this.state.currHoverImg != null){
    //if(this.state.mouseRelativeXPercent != null && this.state.mouseRelativeYPercent != null){
      maskPosition = `${this.state.mouseRelativeXPercent}% ${this.state.mouseRelativeYPercent}%`;

      backgroundStyle = {
        backgroundImage: `url(${this.state.currHoverImg})`,
        "WebkitMaskImage": `url(${mask})`,
        maskImage: `url(${mask})`,

        "WebkitMaskSize": "33%",
        maskSize: "33%",

        "WebkitMaskPosition": `${maskPosition}`,
        maskPosition: `${maskPosition}`
      }
    }

    return (
      <div>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="styles.css" />
        <link rel="icon" href="icon.png" /> 
        <title>Zachariah Micallef</title>
        <div className="bottom-of-page">
          <div>
            <p className="fact-times">{this.state.mouseX}, {this.state.mouseY}</p>
            <p className="fact-times" style={{visibility:`${this.state.mathFact[0] == null ? "hidden" : "visible"}`}}>{this.state.mathFact[0]}</p>
            <p className="fact-times" style={{visibility:`${this.state.mathFact[1] == null ? "hidden" : "visible"}`}}>{this.state.mathFact[1]}</p>
            <p className="fact-times" style={{visibility:`${this.state.mathFact[2] == null ? "hidden" : "visible"}`}}>{this.state.mathFact[2]}</p>
            <p className="fact-times" style={{visibility:`${this.state.mathFact[3] == null ? "hidden" : "visible"}`}}>{this.state.mathFact[3]}</p>
          </div>
          <ScrollingBanner clickFunc = {this.scrollbarRef}/>

          <div className="scrolling-banner-child" onClick = {(() => this.pdfTestSave())}>
          Default2
          </div>

        </div>
        <div>
            {this.getPage()}
        </div>
        <div className="index-main-BG" style={backgroundStyle}></div>
        <div className="index-main-paper" style={{backgroundImage: `url(${this.paperTextures[0]})`, visibility:`${this.state.currPaperTexture == 0 ? "visible" : "hidden"}`}}></div>
        <div className="index-main-paper" style={{backgroundImage: `url(${this.paperTextures[1]})`, visibility:`${this.state.currPaperTexture == 1 ? "visible" : "hidden"}`}}></div>
        <div className="index-main-paper" style={{backgroundImage: `url(${this.paperTextures[2]})`, visibility:`${this.state.currPaperTexture == 2 ? "visible" : "hidden"}`}}></div>
        <div className="index-main-paper" style={{backgroundImage: `url(${this.paperTextures[3]})`, visibility:`${this.state.currPaperTexture == 3 ? "visible" : "hidden"}`}}></div>
        <div className="index-main-paper" style={{backgroundImage: `url(${this.paperTextures[4]})`, visibility:`${this.state.currPaperTexture == 4 ? "visible" : "hidden"}`}}></div>
        
      </div>
    );
  }
}

export default App;
