import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {wordFrequency:[]};
  }
  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  getWordFrequency = (text) => {
    const stopWords = new Set(["the", "and", "a", "an", "in", "on", "at", "for", "with", "about", "as", "by", "to", "of", "from", "that", "which", "who", "whom", "this", "these", "those", "it", "its", "they", "their", "them", "we", "our", "ours", "you", "your", "yours", "he", "him", "his", "she", "her", "hers", "it", "its", "we", "us", "our", "ours", "they", "them", "theirs", "I", "me", "my", "myself", "you", "your", "yourself", "yourselves", "was", "were", "is", "am", "are", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "as", "if", "each", "how", "which", "who", "whom", "what", "this", "these", "those", "that", "with", "without", "through", "over", "under", "above", "below", "between", "among", "during", "before", "after", "until", "while", "of", "for", "on", "off", "out", "in", "into", "by", "about", "against", "with", "amongst", "throughout", "despite", "towards", "upon", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't", "hadn't", "doesn't", "didn't", "don't", "doesn't", "didn't", "won't", "wouldn't", "can't", "couldn't", "shouldn't", "mustn't", "needn't", "daren't", "hasn't", "haven't", "hadn't"]);
    const words = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=_`~()]/g, "").replace(/\s{2,}/g, " ").split(" ");
    const filteredWords = words.filter(word => !stopWords.has(word));
    return Object.entries(filteredWords.reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {}));
  }


  renderChart() {
    const data = this.state.wordFrequency.sort((a,b)=>b[1]-a[1]).slice(0,5)
    console.log(data)

    //Define container dimensions
    const margin = { top: 0, right: 250, bottom: 0, left: 30},
      w = 1000 - margin.left - margin.right,
      h = 150 - margin.top - margin.bottom;

    const container = d3.selectAll(".svg_parent")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .selectAll(".word_cloud").data([0]).join("g").attr("class", "word_cloud")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
    
    //Generate scales
    var x_scale = d3.scaleLinear().domain([0, 4]).range([0, w])

    var y_scale = d3.scaleLinear().domain([0, 10]).range([12, 50])

    container.selectAll(".cloud_word").data(data, d  => d[0])
    .join(
      enter => {
        enter.append("text")
        .attr("class", "cloud_word")
        .attr("x", (d, i) => x_scale(i))
        .attr("y", h/2)
        .text(d => d[0])
        .transition().duration(5000).attr("font-size", d=> y_scale(d[1]))
      },
      update => {
        update.transition().duration(5000).attr("x", (d, i) => x_scale(i)).attr("font-size", d=> y_scale(d[1]))
      },
      exit => exit.remove()
    )
  }

  render() {
    return (
      <div className="parent">
        <div className="child1" style={{width: 1000 }}>
        <textarea type="text" id="input_field" style={{ height: 150, width: 1000 }}/>
          <button type="submit" value="Generate Matrix" style={{ marginTop: 10, height: 40, width: 1000 }} onClick={() => {
                var input_data = document.getElementById("input_field").value
                this.setState({wordFrequency:this.getWordFrequency(input_data)})
              }}
            > Generate WordCloud</button>
        </div>
        <div className="child2"><svg className="svg_parent"></svg></div>
      </div>
    );
  }
}

export default App;