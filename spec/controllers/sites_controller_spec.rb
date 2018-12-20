require 'rails_helper'

RSpec.describe SitesController do
  let(:user) { create(:user) }
  let(:headers) { { 'Accept' => 'application/json', 'Content-Type' => 'application/json' } }
  let(:auth_headers) { Devise::JWT::TestHelpers.auth_headers(headers, user) }

  describe "POST create" do
    before { request.headers.merge! auth_headers }

    context "when params are valid" do
      let(:valid_params) { { site: { name: "Milky Way", location: "Alpha Centauri" } } }

      it "creates a new site" do
        expect{ post :create, params: valid_params }.to change(Site, :count)
      end

      it "returns site data" do
        post :create, params: valid_params

        expect(response.body).to eq({ site: Site.last }.to_json)
      end

      it "returns success response" do
        post :create, params: valid_params

        expect(response).to have_http_status(:ok)
      end
    end

    context "when params are invalid" do
      let(:site_params) { { name: "", location: ""  } }
      let(:invalid_params) { { site: site_params } }
      let(:site) { build(:site, site_params) }

      before { site.valid? }

      it "returns error messages" do
        post :create, params: invalid_params
        expect(response.body).to eq({ errors: site.errors.full_messages }.to_json)
      end

      it "doesn't create a new site" do
        expect{ post :create, params: invalid_params }.to_not change(Site, :count)
      end

      it "returns bad request response" do
        post :create, params: invalid_params

        expect(response).to have_http_status(:bad_request)
      end
    end
  end
end