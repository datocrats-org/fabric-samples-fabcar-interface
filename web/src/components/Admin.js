import React from 'react'
import ReactDom from 'react-dom'
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Form from 'react-bootstrap/lib/Form';
import axios from 'axios';
import config from 'react-global-configuration';

class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        axios.post(config.get('apiurl')+'/register/admin',{})
            .then(response =>this.printresponce(response))
    }

    printresponce(responce){
      //  console.log(responce);
      //  var string = JSON.stringify(responce, null, 2);
      //  console.log(responce.data);
        ReactDom.findDOMNode(this.refs.key).innerHTML='';
        ReactDom.findDOMNode(this.refs.logs).innerHTML='';
        if(responce.data.log.length>0){
            for(var i = 0; i < responce.data.log.length; i++)
            {
                ReactDom.findDOMNode(this.refs.logs).innerHTML+=responce.data.log[i]+ "<br/>";
            }
        }
        ReactDom.findDOMNode(this.refs.key).innerHTML+=responce.data.key;
    }
    render() {
        return (
            <Row>
            <Col xs={12} md={12}>
            <h4 class="mb-3">Create Admin Credentials</h4>
        <Form onSubmit={this.handleSubmit}>
        <Row>
            <Col  md={12} mb={3}>
            <input class="btn btn-primary btn-lg btn-block" type="submit" value="Create Admin User"/>
            </Col>
            <Col  md={12} mb={3}>
            <br/>
            <br/>
            <span ref="key"> </span>
            <br/>
            <br/>
            <span ref="logs"> </span>
        </Col>
        </Row>
        </Form>
        </Col>
        </Row>
    );
    }
}
export default Admin