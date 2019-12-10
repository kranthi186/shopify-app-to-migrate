class Api::V1::AttributesController < AuthenticatedController
  before_action :set_attribute, only: [:show, :edit, :destroy, :update]

  def index
    # puts attribute_index_params.to_json

    currentPage = attribute_index_params[:currentPage].to_i
    perPage = attribute_index_params[:perPage].to_i
    offset = (attribute_index_params[:currentPage].to_i - 1) * perPage

    attributes = Dattribute
      .filtered_attributes(attribute_index_params)
      .offset(offset)
      .limit(perPage)

    totals = Dattribute
      .filtered_attributes(attribute_index_params)
      .count

    totalPages = (totals.to_f / perPage.to_f).ceil
    hasNext = totalPages > currentPage
    hasPrevious = currentPage > 1

    http_success_response({attributes: attributes, hasNext: hasNext, hasPrevious: hasPrevious, totalPages: totalPages, currentPage: currentPage})
  end

  def create
    lastAttribute = Dattribute.last
    @attribute = Dattribute.new(
      id: lastAttribute.id + 1,
      label: attribute_params[:label],
      price: attribute_params[:price],
      price_type: false,
      weight: attribute_params[:weight],
      width: attribute_params[:width],
      length: attribute_params[:length],
      girth: attribute_params[:girth],
      attribute_code: attribute_params[:attribute_code]
    )
    if @attribute.save
      http_success_response({attribute: @attribute})
    else
      http_error_response({error: @attribute.errors.full_messages}, 400)
    end
  end

  def show
    render json: {attribute: @attribute}
  end

  def edit
  end

  def update
    @attribute.update({
      label: attribute_params[:label],
      price: attribute_params[:price],
      price_type: attribute_params[:price_type],
      weight: attribute_params[:weight],
      width: attribute_params[:width],
      length: attribute_params[:length],
      girth: attribute_params[:girth],
      attribute_code: attribute_params[:attribute_code]
    })

    render json: {attribute: @attribute }
  end

  def destroy
    if @attribute.destroy
      http_success_response({})
    else
      http_error_response({message: @attribute.errors.full_messages}, 400)
    end
  end

  def search_options
    attributes = Dattribute
      .filtered_attributes(attribute_index_params)
      .limit(10)
  end
  private
    def attribute_params
      params.except(:id, :controller, :action, :attribute)
    end

    def set_attribute
      @attribute = Dattribute.find(params[:id])
    end

    def attribute_index_params
      params.permit(:currentPage, :searchText, :perPage)
    end

end
