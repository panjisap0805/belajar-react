import { Button } from 'react-bootstrap';
import React, { Component } from 'react'
import { Col, Row } from 'react-bootstrap'
import { numberWithCommas } from '../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import { API_URL } from '../utils/constants';

export default class TotalBayar extends Component {
    submitTotalBayar = (totalBayar) => {
        const pesanan = {
            total_bayar: totalBayar,
            menus: this.props.keranjangs
        }
        
        axios
            .post(API_URL+"pesanans", pesanan)
            .then((res) => {
                this.props.history.push("/sukses")
        })
    }

    render() {
        const totalBayar = this.props.keranjangs.reduce(function (result, item) {
            return result + item.total_harga;
          }, 0);
        return (
            <div className="fixed-bottom">
                <Row>
                    <Col md={{span:3, offset: 9}} className="px-4">
                        <h4>Total Harga Rp.<strong className="float-right mr-2">
                            {numberWithCommas(totalBayar)}</strong></h4>
                        <Button variant="primary" 
                        block className="mb-2 mt-2 mr-2" size="lg"
                        onClick={() => this.submitTotalBayar(totalBayar)}>
                            <FontAwesomeIcon icon={faShoppingCart} /><strong>Bayar</strong>
                        </Button>
                    </Col>
                </Row>
            </div>
        )
    }
}
