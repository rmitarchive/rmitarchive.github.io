import React from 'react';

class ArtPiece extends React.Component {
    constructor(props){
      super(props);
      console.log("TEST: " + JSON.stringify(props));
      this.state = {
        id: props.id,
        img: props.img,
        title: props.title
      };
    }

    render() {
      return(<div>
                <div className="index-img"><img src={this.state.img}/></div>
                <div className="index-line"><span className="times">{this.state.id} - </span><span className="helvetica">{this.state.title}</span></div>
              </div>)
    }
  }
  
  export default ArtPiece;