import React, { Component } from 'react'
import styled, {css} from "styled-components";
import './Style.css'
import axios from 'axios'

const EMPTY = -1;

export default class Calci extends Component {
    constructor(){
        super();
        this.handleDisplay = this.handleDisplay.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleCalculate = this.handleCalculate.bind(this);
        this.handletranslate = this.handletranslate.bind(this);
        this.toother = this.toother.bind(this)
        this.toeng = this.toeng.bind(this);

        this.state ={

            display : '',
            englishText : '',
            translatedText : '',
            toLang : 'en',
            langOptions : []

        }
    }

    handleDisplay = (e) => {
        this.setState({
          display: this.state.display + e.currentTarget.textContent
        });
    }

    handleClear = (e) => {
        this.setState ({
            display: '',
            englishText:'',
            translatedText:''
        })
    } 

    handleDelete = () => {
      var d = this.state.display
      this.setState ({
          display: d.slice(0,d.length-1),
      })
  } 
//mdnawfalag001@
    handletranslate = (e) => {
        this.setState({
            toLang: e.target.value,
        })
        
        if (this.state.englishText!=="") {this.setState({translatedText: <>Please wait...&#129300;</> })} 

        var sign = Math.floor(eval(this.state.display)) < 0 ? 'n' : 'p'
        var englishText = this.state.englishText

        englishText[0] === '-' ? this.toother(englishText.slice(1),e.target.value,sign) : this.toother(englishText,e.target.value,sign)
    }

    toeng(num){
      const translations = new Map([
        [1000000000, 'Billion'],
        [1000000, 'Million'],
        [1000, 'Thousand'],
        [100, 'Hundred and'],
        [90, 'Ninety'],
        [80, 'Eighty'],
        [70, 'Seventy'],
        [60, 'Sixty'],
        [50, 'Fifty'],
        [40, 'Forty'],
        [30, 'Thirty'],
        [20, 'Twenty'],
        [19, 'Nineteen'],
        [18, 'Eighteen'],
        [17, 'Seventeen'],
        [16, 'Sixteen'],
        [15, 'Fifteen'],
        [14, 'Fourteen'],
        [13, 'Thirteen'],
        [12, 'Twelve'],
        [11, 'Eleven'],
        [10, 'Ten'],
        [9, 'Nine'],
        [8, 'Eight'],
        [7, 'Seven'],
        [6, 'Six'],
        [5, 'Five'],
        [4, 'Four'],
        [3, 'Three'],
        [2, 'Two'],
        [1, 'One'],
      ]);
        if (num === 0) {
          return 'Zero';
        }
        
        if (num <= 20) {
          return translations.get(num);
        }
        
        let result = [];
        
        for (let [value, translation] of translations) {
          const times = Math.floor(num / value);
          
          if (times === 0) {
            continue;
          }
          
          num -= times * value;
          
          if (times === 1 && value >= 100) {
            result.push('One', translation);
            continue;
          }
          
          if (times === 1) {
            result.push(translation);
            continue;
          }
          
          result.push(this.toeng(times), translation);
        }
        
        return result.join(' ');
      };

    handleCalculate = (e) => {
        if (this.state.display.indexOf("x") !== EMPTY) {

          let replaceToOperator = this.state.display.replace("x", "*");

          var s1 = this.toeng(Math.abs(Math.floor(eval(replaceToOperator))))

          var sign = Math.floor(eval(replaceToOperator)) < 0 ? 'n' : 'p'

          this.toother(s1,this.state.toLang,sign)

          this.setState({
            display : Math.floor(eval(replaceToOperator)),

            englishText : Math.floor(eval(replaceToOperator))>=0 ? s1 : "-" + s1,

            translatedText: <>Please wait...&#129300;</>
          });

        } 
        else if (this.state.display.indexOf("/") !== EMPTY) {

          let replaceToOperator = this.state.display.replace("/", "/");

          var s2 =  eval(replaceToOperator) === Infinity ? "zero" : this.toeng(Math.abs(Math.floor(eval(replaceToOperator))))

          var p = <>Please wait...&#129300;</>

          var sign = Math.floor(eval(replaceToOperator)) < 0 ? 'n' : 'p'
          
          eval(replaceToOperator) === Infinity ? p = this.toother("zero",this.state.toLang) : this.toother(s2,this.state.toLang,sign)

          this.setState({

            display : eval(replaceToOperator) === Infinity ? 0 : Math.floor(eval(replaceToOperator)) ,
            
            englishText : Math.floor(eval(replaceToOperator))>=0 ? s2 : "-" + s2,

            translatedText : p
          });
        } 
        else {

          var s = this.toeng(Math.abs(Math.floor(eval(this.state.display))))

          var sign = Math.floor(eval(this.state.display)) < 0 ? 'n' : 'p'

          this.toother(s,this.state.toLang,sign)
  
          this.setState({
            display : Math.floor(eval(this.state.display)),
            englishText : Math.floor(eval(this.state.display))>=0 ? s : "-" + s,
            translatedText: <>Please wait...&#129300;</>
          });
        }
    }

    toother(text,toLang,sign){
      var transText = ""
      const params=new URLSearchParams();
      params.append('q',text);
      params.append('source',"en");
      params.append('target',toLang);
      params.append('api_key','xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
      axios.post('https://libretranslate.de/translate',params,{
        headers:{'accept':'application/json',
        'Content-Type':'application/x-www-form-urlencoded'},
      }).then(res=>{
        transText = res.data.translatedText
        this.setState({
          translatedText: sign==='n' ? '-' + transText : transText
        })
    })
  }

  componentDidMount(){
      axios.get("https://libretranslate.de/languages",{headers:{'accept':'application/json'}}).then(res=>{
        this.setState({
          langOptions:res.data
        })
      })
  }
  render() {
    return (
      <>
      <FullContainer>
        <TranslateSection>
          <Display>
            <Screen3>{this.state.display}</Screen3>
            <Screen2>{this.state.englishText}</Screen2>
            <div className="languageSection">
              <label className="labelTab">Select a Language :</label>
              <div className="selectTab">
                <select onChange={this.handletranslate} className="selectBox">
                  {this.state.langOptions.map((opt)=>
                    <option key={opt.code} className="optionTab" value={opt.code}>
                    {opt.name}
                    </option>
                  )}
                </select>
              </div>
            </div>
            <Screen2 >{this.state.translatedText}</Screen2>
          </Display>
        </TranslateSection>
        <Container>
          <Display>
            <Button onClick={this.handleClear} clear>
              C
            </Button>
            <Screen>{this.state.display}</Screen>
          </Display>

          <Keys>
            <Button onClick={this.handleDisplay}>7</Button>
            <Button onClick={this.handleDisplay}>8</Button>
            <Button onClick={this.handleDisplay}>9</Button>

            <Button onClick={this.handleDisplay}>+</Button>

            <Button onClick={this.handleDisplay}>4</Button>
            <Button onClick={this.handleDisplay}>5</Button>
            <Button onClick={this.handleDisplay}>6</Button>

            <Button onClick={this.handleDisplay}>-</Button>

            <Button onClick={this.handleDisplay}>1</Button>
            <Button onClick={this.handleDisplay}>2</Button>
            <Button onClick={this.handleDisplay}>3</Button>

            <Button onClick={this.handleDisplay}>/</Button>

            <Button onClick={this.handleDelete} clear>DEL</Button>
            <Button onClick={this.handleDisplay}>0</Button>
            <Button onClick={this.handleCalculate} eval>
              =
            </Button>

            <Button onClick={this.handleDisplay}>x</Button>
          </Keys>
        </Container>
      </FullContainer>
    </>
    );
  }
}

const FullContainer = styled.div`
  margin: 20px 50px;
`;
const Dropdown = styled.div`
    float: right;
    font-size: 24px;
`;
const Screen2 = styled.div`
  height: 150px;
  width: 95%;
  margin: 20px 0;
  align-item: center;
  justify-content: space-around;
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 3px;
  box-shadow: inset 0px 4px rgba(0, 0, 0, 0.2);
  font-size: 20px;
  line-height: 40px;
  color: black;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  text-align: left;
  letter-spacing: 1px;
`;

const Screen3 = styled(Screen2)`
height: 50px;
`;

const TranslateSection = styled.div`
  float: left;
  width: 600px;
  height: 80vh;
  padding: 40px 40px 9px;
  background: black;
  background: linear-gradient(black, navy);
  border-radius: 3px;
  box-shadow: 0px 4px #009de4, 0px 10px 15px rgba(0, 0, 0, 0.2);
`;

const Container = styled.div`
  // margin-top: 40px;
  float: right;
  width: 500px;
  height: 80vh;
  padding: 40px 40px 9px;
  background: black;
  background: linear-gradient(black, navy);
  border-radius: 3px;
  box-shadow: 0px 4px #009de4, 0px 10px 15px rgba(0, 0, 0, 0.2);
  justify-content:center;
`;

const Display = styled.div`
  overflow: hidden;
`;

const Keys = styled(Display)``;

const Screen = styled.div`
  height: 80px;
  width: 320px;
  float: left;
  padding: 0 10px;
  background: rgba(140, 140, 140, 0.8);
  border-radius: 3px;
  box-shadow: inset 0px 4px rgba(0, 0, 0, 0.2);
  font-size: 24px;
  line-height: 40px;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  text-align: right;
  letter-spacing: 1px;
`;

const Button = styled.button`
  font-size: 24px;
  float: left;
  position: relative;
  top: 0;
  cursor: pointer;
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 3px;
  box-shadow: 0px 4px rgba(0, 0, 0, 0.2);
  border: none;
  margin: 0 45px 15px 0;
  color: #888;
  line-height: 36px;
  text-align: center;
  user-select: none;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
  }

  &:hover {
    background: #9c89f6;
    box-shadow: 0px 4px #6b54d3;
    color: white;
  }

  &:active {
    box-shadow: 0px 0px #6b54d3;
    top: 4px;
  }

  ${(props) =>
    props.operator &&
    css`
      background: #fff0f5;
      margin-right: 0;
    `}

  ${(props) =>
    props.eval &&
    css`
      background: #f1ff92;
      box-shadow: 0px 4px #9da853;
      color: #888e5f;

      &:hover {
        background: #abb850;
        box-shadow: 0px 4px #717a33;
        color: #ffffff;
      }

      &:active {
        box-shadow: 0px 0px #717a33;
        top: 4px;
      }
    `}

  ${(props) =>
    props.clear &&
    css`
      background: #ff9fa8;
      box-shadow: 0px 4px #ff7c87;
      color: white;

      &:hover {
        background: #f68991;
        box-shadow: 0px 4px #d3545d;
        color: white;
      }

      &:active {
        top: 4px;
        box-shadow: 0px 0px #d3545d;
      }
    `}
`;