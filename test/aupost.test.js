'use strict';

let path = require('path');
let chai = require('chai');
let expect = chai.expect;
let agentOne = require('superagent');
let data = require(path.join(__dirname, '/config/data'));

describe('AUPOST API', function () {
    this.timeout(data['apiTimeout']);

    it('should be able to calculate the postage for letter based on the test criteria', async function () {
        //find fromPostCode
        let res = await agentOne
            .get(data.url + 'postcode/search.json?q=' + data['test']['fromSuburb'] + '&state=' + data['test']['fromState'])
            .set('auth-key', data['key']);
        let fromPostCode = res.body['localities']['locality']['postcode'];

        //find toPostCode
        res = await agentOne
            .get(data.url + 'postcode/search.json?q=' + data['test']['toSuburb'] + '&state=' + data['test']['toState'])
            .set('auth-key', data['key']);
        let toPostCode = res.body['localities']['locality']['postcode'];

        //pick a sample domestic letter length
        res = await agentOne
            .get(data.url + 'postage/letter/domestic/size.json')
            .set('auth-key', data['key']);
        let dimensions = res.body['sizes']['size'][0]['value'];
        let length = dimensions.split('x')[0];
        let width = dimensions.split('x')[1];

        //pick a sample letter thickness
        res = await agentOne
            .get(data.url + 'postage/letter/domestic/thickness.json')
            .set('auth-key', data['key']);
        let thickness = res.body['thicknesses']['thickness'][0]['value'];

        //pick a sample letter weight
        res = await agentOne
            .get(data.url + 'postage/letter/domestic/weight.json')
            .set('auth-key', data['key']);
        let weight = res.body['weights']['weight'][0]['value'];

        //pick the first matching service code
        res = await agentOne
            .get(data.url + 'postage/letter/domestic/service.json?' +
                'length=' + length +
                '&width=' + width +
                '&thickness=' + thickness +
                '&weight=' + weight)
            .set('auth-key', data['key']);
        let serviceCode = res.body['services']['service'][0]['code'];
        res = await agentOne
            .get(data.url + 'postage/letter/domestic/calculate.json?' +
                'service_code=' + serviceCode +
                '&weight=' + weight)
            .set('auth-key', data['key']);

        expect(res.body['postage_result']['service']).to.be.not.empty;
        expect(res.body['postage_result']['delivery_time']).to.be.not.empty;
        expect(res.body['postage_result']['total_cost']).to.be.not.empty;
        expect(res.body['postage_result']['costs']['cost']['item']).to.be.not.empty;
        expect(res.body['postage_result']['costs']['cost']['cost']).to.be.not.empty;
    });

    it('should return postcode of the suburb', async function()  {
        let res = await agentOne
            .get(data.url + 'postcode/search.json?q=' + data['test']['suburb'] + '&state=' + data['test']['state'])
            .set('auth-key', data['key']);
        let fromPostCode = res.body['localities']['locality']['postcode'];
        expect(res.text).to.be.not.empty;
    });

    it('should return list of domestic letter weights', async function()  {
        let res = await agentOne
            .get(data.url + 'postage/letter/domestic/weight.json')
            .set('auth-key', data['key']);
        expect(res.text).to.be.not.empty;
    });

    it('should return list of domestic letter sizes', async function()  {
        let res = await agentOne
            .get(data.url + 'postage/letter/domestic/size.json')
            .set('auth-key', data['key']);
        expect(res.text).to.be.not.empty;
    });

    it('should return list of domestic letter thickness', async function()  {
        let res = await agentOne
            .get(data.url + 'postage/letter/domestic/thickness.json')
            .set('auth-key', data['key']);
        expect(res.text).to.be.not.empty;
    });

    it('should return list of service types', async function()  {
        let res = await agentOne
            .get(data.url + 'postage/parcel/domestic/service.json?' +
                'from_postcode=2000' +
                '&to_postcode=3000' +
                '&length=10&width=10' +
                '&height=10&weight=1')
            .set('auth-key', data['key']);
        expect(res.text).to.be.not.empty;
    });


});