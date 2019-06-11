import React from "react";

export default class AddTodo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: ""
    };
  }

  handleChange(name, ev) {
    this.setState({ [name]: ev.target.value });
  }

  async submit() {
    const { onCreate } = this.props;

    var input = {
      name: this.state.name,
      description: this.state.description
    };

    await onCreate({ input });

    this.setState({ name: "", description: "" });
  }

  render() {
    return (
      <div>
        <input
          name="name"
          placeholder="name"
          value={this.state.name}
          onChange={ev => {
            this.handleChange("name", ev);
          }}
        />
        <input
          name="description"
          placeholder="description"
          value={this.state.description}
          onChange={ev => {
            this.handleChange("description", ev);
          }}
        />
        <button onClick={this.submit.bind(this)}>Add</button>
      </div>
    );
  }
}
