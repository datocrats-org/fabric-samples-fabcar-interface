import React from 'react'
import ReactDom from 'react-dom'
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Form from 'react-bootstrap/lib/Form';
import axios from 'axios';
import config from 'react-global-configuration';
import ReactTable from 'react-table'
import RTable from './RTable'


class Transactions extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state={data:[]}
    }
    handleSubmit(e) {
        e.preventDefault();
        let username = ReactDom.findDOMNode(this.refs.username);
        let channel = ReactDom.findDOMNode(this.refs.channel);
        let query = ReactDom.findDOMNode(this.refs.query);
        //   let pubkey = ReactDom.findDOMNode(this.refs.pubkey);
        let pubkey = '';
        axios.post(config.get('apiurl')+'/transaction/query',{username:username.value,channel:channel.value,query:query.value})
            .then(response =>this.printresponce(response))
    }

    printresponce(responce){
        // console.log(responce);
        // var string = JSON.stringify(responce, null, 2);
        ReactDom.findDOMNode(this.refs.logs).innerHTML='';
        ReactDom.findDOMNode(this.refs.data).innerHTML='';
        if(responce.data.log.length>0){
            for(var i = 0; i < responce.data.log.length; i++)
            {
                ReactDom.findDOMNode(this.refs.logs).innerHTML+=responce.data.log[i]+ "<br/>";
            }
        }
        let datar=[];
        console.log(responce.data.data);
        for(var i = 0; i < responce.data.data.length; i++) {
            responce.data.data[i].Record.key=responce.data.data[i].Key;
            datar.push(responce.data.data[i].Record);
        }

        this.setState({data:datar});

    }
    render() {
        return (
            <Row>
            <Col xs={12} md={12}>
            <h4 class="mb-3">Transaction Queries</h4>
        <Form onSubmit={this.handleSubmit}>
    <Row>
        <Col  md={4} mb={3}>
            <label for="username">Username</label>
            <input type="text" class="form-control" id="username" ref="username" value="admin" />
            </Col>
            <Col  md={4} mb={3}>
            <label for="organization">Chanels </label>
            <select class="custom-select d-block w-100" id="channel" ref="channel" required>
        <option value="">Choose Chanel...</option>
        <option selected>mychannel</option>
        </select>
        </Col>
        <Col  md={4} mb={3}>
            <label for="role">Query </label>
            <select class="custom-select d-block w-100" id="query"  ref="query" ref="query" required>
        <option value="">Choose query...</option>
        <option selected>queryAllCars</option>
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
            <input class="btn btn-primary btn-lg btn-block" type="submit" value="Run Query"/>
            </Col>
            <Col  md={12} mb={3}>
            <div class="form-group">
            <br/>
            <br/>
            <span ref="data"> </span>
            <br/>
            <br/>
            <span ref="logs"> </span>
            </div>
            </Col>
            </Row>
            </Form>
            </Col>
            <Col  md={12} mb={3}>
                <RTable datar={this.state.data}/>
            </Col>
            </Row>


    );
    }
}
export default Transactions