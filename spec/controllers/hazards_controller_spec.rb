require 'rails_helper'

RSpec.describe HazardsController do
  let(:user) { create(:user) }
  let(:site) { create(:site) }
  let(:headers) { { 'Accept' => 'application/json', 'Content-Type' => 'application/json' } }
  let(:auth_headers) { Devise::JWT::TestHelpers.auth_headers(headers, user) }

  describe 'GET #index' do
    before do
      request.headers.merge! auth_headers
      2.times do
        create(:hazard, site: site)
        create(:hazard)
      end
    end

    it 'returns all hazards tied to a specific site' do
      get :index, params: { site_id: site.id }
      result     = JSON.parse(response.body)
      extract_id = -> (h) { h['id'] }

      expect(result.count).to eq(2)
      expect(result.map(&extract_id)).to eq(Hazard.where(site: site).pluck(:id))
    end

    it 'returns success response' do
      get :index, params: { site_id: site.id }

      expect(response).to have_http_status(:ok)
    end
  end
end