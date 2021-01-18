import { Row, Col, Container } from 'react-bootstrap'
import { Cart, ListCategories, Menus } from '../components'
import React, { Component } from 'react'
import { API_URL } from '../utils/constants'
import axios from 'axios'
import swal from 'sweetalert'

export default class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            menus: [],
            clickedCategory: "Makanan",
            keranjangs: []
        }
    }

    componentDidMount() {
        axios
            .get(API_URL + "products?category.nama=" + this.state.clickedCategory)
            .then(res => {
                const menus = res.data;
                this.setState({ menus });
            })
            .catch(error => {
                console.log(error);
            })

        this.getListKeranjang();
    }

    componentDidUpdate(prevState) {
        if (this.state.keranjangs !== prevState.keranjangs) {
            axios
                .get(API_URL + "keranjangs")
                .then(res => {
                    const keranjangs = res.data;
                    this.setState({ keranjangs });
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    getListKeranjang = () => {
        axios
        .get(API_URL + "keranjangs")
        .then(res => {
            const keranjangs = res.data;
            this.setState({ keranjangs });
        })
        .catch(error => {
            console.log(error);
        })
    }

    changeCategory = (value) => {
        this.setState({
            clickedCategory: value,
            menus: []
        })

        axios
            .get(API_URL + "products?category.nama=" + value)
            .then(res => {
                const menus = res.data;
                this.setState({ menus });
            })
            .catch(error => {
                console.log(error);
            })
    }

    addMenu = (value) => {
        axios
            .get(API_URL + "keranjangs?product.id=" + value.id)
            .then(res => {
                if (res.data.length === 0) {
                    const keranjang = {
                        jumlah: 1,
                        total_harga: value.harga,
                        product: value
                    }

                    axios
                        .post(API_URL + "keranjangs", keranjang)
                        .then(res => {
                            this.getListKeranjang();
                            swal({
                                title: "Success",
                                text: keranjang.product.nama + " added to cart",
                                icon: "success",
                                button: false,
                                timer: 1000
                            });
                        })
                        .catch(error => {
                            console.log(error);
                        })
                } else {
                    const keranjang = {
                        jumlah: res.data[0].jumlah + 1,
                        total_harga: res.data[0].total_harga + value.harga,
                        product: value
                    }
                    axios
                        .put(API_URL + "keranjangs/" + res.data[0].id, keranjang)
                        .then(res => {
                            swal({
                                title: "Success",
                                text: keranjang.product.nama + " added to cart",
                                icon: "success",
                                button: false,
                                timer: 1000
                            });
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        const { menus, clickedCategory, keranjangs } = this.state
        return (
            <div className="mt-3">
                <Container fluid>
                    <Row>
                        <ListCategories 
                        changeCategory={this.changeCategory} 
                        clickedCategory={clickedCategory} />
                        <Col>
                            <h4><strong>Menu's</strong></h4>
                            <hr />
                            <Row>
                                {menus &&
                                    menus.map((menu) => (
                                        <Menus
                                            key={menu.id}
                                            menu={menu}
                                            addMenu={this.addMenu} />
                                    ))}
                            </Row>
                        </Col>
                        <Cart keranjangs={keranjangs} {...this.props}/>
                    </Row>
                </Container>
            </div>
        )
    }
}