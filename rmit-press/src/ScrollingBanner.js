
import React from 'react';

//<div className="index-img"><img src={this.state.img}/></div>
//<div className="index-line"><span className="times">{this.state.id} - </span><span className="helvetica" onMouseOver={() => this.testHover()}>{this.state.title}</span></div>
class ScrollingBanner extends React.Component {
    constructor(props){
      super(props);
      this.state = {

      };
    }

    render() {
      let list = []
    for(var i = 0; i< 50; i++){
      list.push(<div className="scrolling-banner-child" style={{
        //backgroundColor: `${(i % 2 == 0 ? "white" : "grey")}`
        //borderColor: `${(i % 2 == 0 ? "white" : "grey")}`
        //borderColor: `${(i % 2 == 0 ? "#ededed" : "#dedede")}`
        borderColor: `${(i % 2 == 0 ? "grey" : "grey")}`
      }}><p className="times">{i.toString().padStart(3, '0')}</p></div>);
    }


      return(<div className="scrolling-banner-parent">
                {list}
              </div>)
    }
  }
  
  export default ScrollingBanner;