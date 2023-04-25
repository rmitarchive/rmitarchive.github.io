import React from 'react';

//<div className="index-img"><img src={this.state.img}/></div>
//<div className="index-line"><span className="times">{this.state.id} - </span><span className="helvetica" onMouseOver={() => this.testHover()}>{this.state.title}</span></div>
class ArtPiece extends React.Component {
    constructor(props){
      super(props);
      console.log("TEST: " + JSON.stringify(props));
      this.state = {
        id: props.id,
        img: props.img,
        title: props.title,
        hoverOverTextFunc: props.hoverOverTextFunc,
        hoverExitTextFunc: props.hoverExitTextFunc
      };
    }

    render() {
      return(<div>
                <div className="index-line"><span className="times">{this.state.id} - </span><span className="helvetica" onMouseLeave={() => this.state.hoverExitTextFunc(this.state)} onMouseOver={() => this.state.hoverOverTextFunc(this.state)}>{this.state.title}</span></div>
              </div>)
    }
  }
  
  export default ArtPiece;