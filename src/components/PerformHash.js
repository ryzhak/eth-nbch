import React, { Component } from 'react';
import createKeccakHash from 'keccak';
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider);
let accounts = [];
web3.eth.getAccounts().then((_accounts) => { accounts = _accounts; });

class WriteHash extends Component {

    constructor(props) {

        super(props);

        this.state = {
            passportSerial: '',
            inn: '',
            creditDocumentNumber: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        
        event.preventDefault();
        
        // calculate hash
        const strToHash = `${this.state.passportSerial}${this.state.inn}${this.state.creditDocumentNumber}`;
        const hashedStr = createKeccakHash('keccak256').update(strToHash).digest('hex'); 

        
        const abi = [{"constant":true,"inputs":[{"name":"creditDocumentHash","type":"string"}],"name":"read","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"creditDocumentHash","type":"string"}],"name":"write","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
        const contractAddress = "0x6d45e6C38A40AeDBB0168CC32faCBedE0D9d88a8";
        const nbchContract = new web3.eth.Contract(abi, contractAddress);

        if (this.props.type === 'write') {
            // send transaction to ethereum
            nbchContract.methods.write(hashedStr).send({from: accounts[0]})
            .on('error', function(error){
                alert("Error");
                console.error(error);
            })
            .then(function(result){
                alert('Loan data saved');
                console.log(result);
            });
        } else {
            // type is read and we check credit data
            nbchContract.methods.read(hashedStr).call({from: accounts[0]})
            .then(function(found){
                if(found) {
                    alert('Loan is fully repaid');
                } else {
                    alert('Loan is not found');
                }
            });
        }
    }

    render() {
        return (
            <div>
                <h3>{this.props.type === 'write' ? 'Write credit details' : 'Check'}</h3>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Passport serial</label>
                        <input name="passportSerial" type="text" className="form-control" onChange={this.handleChange} value={this.state.passportSerial} />
                    </div>
                    <div className="form-group">
                        <label>Creditor INN</label>
                        <input name="inn" type="text" className="form-control" onChange={this.handleChange} value={this.state.inn} />
                    </div>
                    <div className="form-group">
                        <label>Credit document number</label>
                        <input name="creditDocumentNumber" type="text" className="form-control" onChange={this.handleChange} value={this.state.creditDocumentNumber} />
                    </div>
                    <button type="submit" className="btn btn-primary">{this.props.type === 'write' ? 'Save' : 'Check'}</button>
                </form>
            </div>
        );
    }

}

export default WriteHash;