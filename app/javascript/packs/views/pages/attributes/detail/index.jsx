import React, { Component, Fragment, useState, useCallback } from 'react'
import { Page, Layout, PageActions, Card, Select, TextStyle, Button, TextContainer, FormLayout, TextField, ButtonGroup } from '@shopify/polaris'
import { connect } from 'react-redux'
import SkeletonLoader from '../../../components/skeleton-loader'

import ConfirmModal from '../../../components/confirm-modal'

import {
  loadAttribute,
  createAttribute,
  deleteAttribute,
  updateAttribute
} from '../../../../actions/attribute'

class NewAttribute extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      id: null,
      index: 0,
      label: '',
      price: 0,
      price_type: false,
      weight: 0,
      width: 0,
      length: 0,
      girth: 0,
      attribute_code: '',
      key: 0,
      saving: false,
      confirming: false,
      confirmModal: false
    }

    this.handleTypeChange = this.handleTypeChange.bind(this)
  }

  componentWillMount () {
    this.setState({
      id: this.props.match.params.id
    })
  }

  componentDidMount () {
    const { id } = this.state
    if (id) {
      this.setState({loading: true})
      this.props.loadAttribute({
        id,
        cb: data => {
          this.setState({
            label: data.attribute.label,
            price: data.attribute.price,
            price_type: data.attribute.price_type,
            weight: data.attribute.weight,
            width: data.attribute.width,
            length: data.attribute.length,
            girth: data.attribute.girth,
            attribute_code: data.attribute.attribute_code,
            loading: false
          })
        }
      })
    }

  }

  handleChange = property => value => {
    this.setState({[property]: value})
  }

  handleTypeChange = event => {
    this.setState({price_type: event.target.value})
  }

  handleSave = () => {
    const { id, label, price, price_type, weight, width, length, girth, attribute_code } = this.state
    this.setState({saving: true})
    if (id) {
      this.props.updateAttribute({
        id,
        label,
        price,
        price_type,
        weight,
        width,
        length,
        girth,
        attribute_code,
        cb: data => {
          this.setState({saving: false})
        }
      })
    } else {
      this.props.createAttribute({
        label,
        price,
        price_type,
        weight,
        width,
        length,
        girth,
        attribute_code,
        cb: data => {
          this.setState({saving: false})
          this.props.history.push({
            pathname: `/attributes/${data.attribute.id}/edit`,
          })
        }
      })
    }
  }

  render () {
    const { id, label, price, price_type, weight, width, length, girth, attribute_code, loading, saving, confirmModal, confirming } = this.state
    const primaryAction = {
      content: 'Save',
      loading: saving,
      onAction: this.handleSave
    }

    const secondaryActions = null
    
    return (
      <Fragment>
        {
          !loading &&
          <Page
            title={id ? 'Edit Attribute' : 'New Attribute'}
            primaryAction={primaryAction}
            breadcrumbs={[{content: 'Attributes', url: '/attributes'}]}
          >
            <Layout>
              <Layout.Section>
                <Card
                  sectioned
                  title="Attribute name"
                >
                  <TextField
                    value={label}
                    label="attribute name"
                    labelHidden
                    onChange={this.handleChange('label')}
                  />
                </Card>
              </Layout.Section>
              <Layout.Section>
                <Card
                  title="Property management"
                  sectioned
                >
                  <Card.Section>
                    <Fragment>
                      <FormLayout.Group>
                        <TextField
                          value={price}
                          onChange={this.handleChange('price')}
                          label="Price"
                        />
                        <label>
                          Upcharge Type<br/>
                          <select value={price_type} onChange={this.handleTypeChange} className="select-type">
                            <option value="false">Add On</option>
                            <option value="true">Percent</option>
                          </select>
                        </label>
                        <TextField
                          value={attribute_code}
                          onChange={this.handleChange('attribute_code')}
                          label="SKU"
                        />

                        <TextField
                          value={weight}
                          onChange={this.handleChange('weight')}
                          label="Weight"
                        />
                        <TextField
                          value={width}
                          onChange={this.handleChange('width')}
                          label="Width"
                        />
                        <TextField
                          value={length}
                          onChange={this.handleChange('length')}
                          label="Length"
                        />
                        <TextField
                          value={girth}
                          onChange={this.handleChange('girth')}
                          label="Girth"
                        />
                      </FormLayout.Group>
                    </Fragment>
                  </Card.Section>
                </Card>
              </Layout.Section>
              <Layout.Section>
                <PageActions
                  primaryAction={primaryAction}
                  secondaryActions={secondaryActions}
                />
              </Layout.Section>
              <ConfirmModal
                active={confirmModal}
                confirming={confirming}
                title="Are you sure?"
                description="Do you really want to remove this record permanently?"
                onConfirm={this.deleteTemplate}
                toggleConfirm={this.toggleConfirm}
              />
            </Layout>
          </Page>
        }
        {
          loading && <SkeletonLoader level={2}/>
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  
})

const mapDispatchToProps = {
  loadAttribute,
  createAttribute,
  deleteAttribute,
  updateAttribute
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewAttribute)