import React, { Component } from "react";
import { PageHeader, Table } from "react-bootstrap";
import { API, graphqlOperation } from "aws-amplify";
import { Connect } from "aws-amplify-react";
import "./Home.css";
import AddTodo from "./AddTodo";

const listTodos = `
  query listTodos {
    todos {
      id
      name
      description
    }
  }
`;

const createTodo = `
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      id
      name
      description
    }
  }
`;

const onCreateTodo = `
  subscription OnCreateTodo {
    onCreateTodo {
      id
      name
      description
    }
  }
`;

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      todos: []
    };
  }

  componentDidMount() {
    // console.log("props", this.props);
    // if (!this.props.isAuthenticated) {
    //   return;
    // }

    this.getTodos();
  }

  getTodos = () => {
    API.graphql(graphqlOperation(listTodos)).then(({ data }) =>
      this.setState({ todos: data.todos, isLoading: false })
    );
  };

  renderLander() {
    return (
      <div className="lander">
        <h1>Todos App</h1>
        <p>Loading..</p>
      </div>
    );
  }

  renderTest() {
    return (
      <div className="test">
        <PageHeader>Todos</PageHeader>
        <Connect mutation={graphqlOperation(createTodo)}>
          {({ mutation }) => <AddTodo onCreate={mutation} />}
        </Connect>

        <br />

        {this.state.isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {this.state.todos.map(todo => (
                <tr key={todo.id}>
                  <td>{todo.id}</td>
                  <td>{todo.name}</td>
                  <td>{todo.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderTest() : this.renderLander()}

        <Connect
          query={graphqlOperation(listTodos)}
          subscription={graphqlOperation(onCreateTodo)}
          onSubscriptionMsg={(prev, { onCreateTodo }) => {
            this.setState(({ todos }) => ({
              todos: todos.concat([onCreateTodo])
            }));
            return prev;
          }}
        >
          {() => {
            return null;
          }}
        </Connect>
      </div>
    );
  }
}
