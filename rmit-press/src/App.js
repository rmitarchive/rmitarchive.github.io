import logo from './logo.svg';
import './App.css';
import baseHoverImg from "./Img/icon.png";
import imgOne from "./Img/Screenshot_1.png";
//import imgOne from "./Img/Screenshot 2023-04-25 at 2.18.46 pm.png";
import imgTwo from "./Img/icarus1.jpg";
import ArtPiece from "./ArtPiece";
import React from 'react';

//<div className="index-img"><img src={imgTwo} /></div>
//<div className="index-line"><span className="times">001 - </span><span className="helvetica">Zach Micallef, Icarus, 2023.</span></div>

class App extends React.Component {
  constructor(props){
    super(props);
    //does whatever stuff        
    this.testHover = this.testHover.bind(this);
    this.clearHover = this.clearHover.bind(this);
    this.state={
      baseHoverImg: baseHoverImg,
      currHoverImg: null
    }
  }

  testHover(props){
    console.log("inner APP hover works: " + JSON.stringify(props));
    this.setState({currHoverImg: props.img});
  }

  clearHover(props){
    console.log("inner APP hover works: " + JSON.stringify(props));
    this.setState({currHoverImg: null});
  }
  
  render() {
    return (
      <div>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="styles.css" />
        <link rel="icon" href="icon.png" /> 
        <title>Zachariah Micallef</title>
        <header>
          <span className="times">Bachelor of Design (Communication Design).</span>
          <span className="helvetica"> Graduate Exhibition. June 15.</span>
          <span className="times">Bowen Street. (Event is Wheelchair Accessible)</span>
        </header>
        <footer>
          <span className="helvetica">www.rmit.edu.au</span>
          <br />
          <span className="helvetica">www.instagram.com/designrmit</span>
        </footer>  
        <div className="index-main" style={{backgroundImage: `url(${(this.state.currHoverImg == null ? this.state.baseHoverImg : this.state.currHoverImg)})`}}>
          <div className="index-content"> 
            <ArtPiece hoverOverTextFunc={this.testHover} hoverExitTextFunc={this.clearHover} id="001" img={imgOne} title="Nicholas Gleeson, Arpeggiated Visualiser, 2023."/>
            <ArtPiece hoverOverTextFunc={this.testHover} hoverExitTextFunc={this.clearHover} id="002" img={imgTwo} title="Zach Micallef, Icarus, 2023."/>
            
          </div>
        </div>
        <div className="index-right">
          <dl>
            <dt>001</dt>
            <dt>002</dt>
            <dt>003</dt>
            <dt>004</dt>
            <dt>005</dt>
            <dt>006</dt>
            <dt>007</dt>
            <dt>008</dt>
            <dt>009</dt>
            <dt>010</dt>
            <dt>011</dt>
            <dt>012</dt>
            <dt>013</dt>
            <dt>014</dt>
            <dt>015</dt>
            <dt>016</dt>
            <dt>017</dt>
            <dt>018</dt>
            <dt>019</dt>
            <dt>020</dt>
            <dt>021</dt>
            <dt>022</dt>
            <dt>023</dt>
            <dt>024</dt>
            <dt>025</dt>
            <dt>026</dt>
            <dt>027</dt>
            <dt>028</dt>
            <dt>029</dt>
            <dt>030</dt>
            <dt>031</dt>
            <dt>032</dt>
            <dt>033</dt>
            <dt>034</dt>
            <dt>035</dt>
            <dt>036</dt>
            <dt>037</dt>
            <dt>038</dt>
            <dt>039</dt>
            <dt>040</dt>
            <dt>041</dt>
            <dt>042</dt>
            <dt>043</dt>
            <dt>044</dt>
            <dt>045</dt>
            <dt>046</dt>
            <dt>047</dt>
            <dt>048</dt>
            <dt>049</dt>
            <dt>050</dt>
          </dl>
        </div>
      </div>
    );
  }
}

export default App;
