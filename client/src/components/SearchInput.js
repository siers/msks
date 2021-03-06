import React from 'react'

import '../styles/SearchInput.css'

class SearchInput extends React.Component {
  inputNode = null

  onInputRef = node => {
    this.inputNode = node
  }

  componentDidMount() {
    if (!this.props.query.text) {
      this.inputNode.focus()
    }
  }

  render() {
    return (
      <div className='SearchInput'>
        <input
          className='nick'
          placeholder='Nick'
          value={this.props.query.nick || ''}
          onChange={ev => this.props.inputSearch({ nick: ev.target.value })}
          spellCheck={false}
        />
        <input
          ref={this.onInputRef}
          className='text'
          placeholder='Search Text'
          value={this.props.query.text || ''}
          onChange={ev => this.props.inputSearch({ text: ev.target.value })}
          spellCheck={false}
        />
      </div>
    )
  }
}

export default SearchInput
