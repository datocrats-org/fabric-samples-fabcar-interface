import React from 'react'
import ReactDom from 'react-dom'
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Form from 'react-bootstrap/lib/Form';
import axios from 'axios';
import config from 'react-global-configuration';

class Newuser extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        let username = ReactDom.findDOMNode(this.refs.username);
        let organization = ReactDom.findDOMNode(this.refs.organization);
        let role = ReactDom.findDOMNode(this.refs.role);
     //   let pubkey = ReactDom.findDOMNode(this.refs.pubkey);
        let pubkey = '';
        axios.post(config.get('apiurl')+'/register/user',{username:username.value,organization:organization.value,role:role.value,pubkey:pubkey.value})
             .then(response =>this.printresponce(response))
    }

    printresponce(responce){
       // console.log(responce);
       // var string = JSON.stringify(responce, null, 2);
        ReactDom.findDOMNode(this.refs.logs).innerHTML='';
        ReactDom.findDOMNode(this.refs.key).innerHTML='';
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
                      <h4 class="mb-3">User Details</h4>
                           <Form onSubmit={this.handleSubmit}>
                            <Row>
                                 <Col  md={4} mb={3}>
                                    <label for="username">Username</label>
                                    <input type="text" class="form-control" id="username" ref="username" />
                                </Col>
                                <Col  md={4} mb={3}>
                                    <label for="organization">Organization </label>
                                    <select class="custom-select d-block w-100" id="organization" ref="organization" required>
                                        <option value="">Choose Organization...</option>
                                        <option selected>ORG1</option>
                                    </select>
                                </Col>
                                <Col  md={4} mb={3}>
                                    <label for="role">Role </label>
                                    <select class="custom-select d-block w-100" id="role"  ref="role" ref="role" required>
                                        <option value="">Choose Role...</option>
                                        <option selected>client</option>
                                    </select>
                                </Col>
                                <Col  md={12} mb={3} >
                                <div class="form-group" class="d-none">
                                <label for="exampleFormControlTextarea1">Public key</label>
                                 <textarea class="form-control" id="exampleFormControlTextarea1" rows="5" ref="pubkey" />
                                </div>
                                 </Col>
                            <Col  md={12} mb={3}>
                            <br />
                            <br />
                                <input class="btn btn-primary btn-lg btn-block" type="submit" value="Deploy User to Blockchain"/>
                            </Col>
                            <Col  md={12} mb={3}>
                              <div class="form-group">
                                <br/>
                                <br/>
                                <span ref="key"> </span>
                                <br/>
                                <br/>
                                <span ref="logs"> </span>
                              </div>
                            </Col>
                           </Row>
                        </Form>

                </Col>
            </Row>

    );
    }

}

export default Newuser