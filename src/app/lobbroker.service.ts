import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Headers, RequestOptions } from '@angular/http';
import { map } from "rxjs/operators";

@Injectable()
export class LobBrokerService {
    url:string = "http://localhost/Hyland.Integrations.LOBBrokerRelayService2/LOBBrokerRelayService.svc";
    constructor(private http: Http) {

    }

    getPostsObserv() {
        return this.http.get(this.url).pipe(map((resp:Response) => {
            return resp.json();
        }))
    }

    getOperations() {
        let headers = new Headers({ 'Content-Type': 'text/xml',
                                    'SOAPAction' : 'http://tempuri.org/ILOBBrokerRelayService_v15/GetOperations',
                                    'Access-Control-Allow-Origin' : '*'});
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url, this.makeGetOperationsXml(), options)
                   .pipe(map((resp:Response) => {
                        return resp;
                    }));

    }

    runOperation(operName:string, reqMessage:string) {
        let headers = new Headers({ 'Content-Type': 'text/xml',
                                    'SOAPAction' : 'http://tempuri.org/ILOBBrokerRelayService_v15/ExecuteOperation',
                                    'Access-Control-Allow-Origin' : '*'});
        let options = new RequestOptions({ headers: headers });

        if (operName == 'PostPOInvoice') {
            return this.http.post(this.url, this.makeExecuteOperationXmlWithCDATA(operName, reqMessage), options)
                    .pipe(map((resp:Response) => {
                            return resp;
                        }));
        } else {
            return this.http.post(this.url, this.makeExecuteOperationXml(operName, reqMessage), options)
                    .pipe(map((resp:Response) => {
                            return resp;
                        }));            
        }
    }

    makeGetOperationsXml() {
        var str = `
                <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
                    <soapenv:Header/>
                            <soapenv:Body>
                                <tem:GetOperations/>
                        </soapenv:Body>
                  </soapenv:Envelope>
                  `;
        return str; 
    }

    makeExecuteOperationXml(operName:string, reqMessage:string) {
        var str = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <tem:ExecuteOperation>
                        <tem:opName>` + operName + `</tem:opName>
                        <tem:requestMessage>` + reqMessage + `</tem:requestMessage>
                        <tem:lastChecksum>1</tem:lastChecksum>
                    </tem:ExecuteOperation>
                    </soapenv:Body>
                </soapenv:Envelope>`;
        return str;
    }

    makeExecuteOperationXmlWithCDATA(operName:string, reqMessage:string) {
        var str = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <tem:ExecuteOperation>
                        <tem:opName>` + operName + `</tem:opName>
                        <tem:requestMessage>`+ '<![CDATA[' + reqMessage + ']]>' + `</tem:requestMessage>
                        <tem:lastChecksum>1</tem:lastChecksum>
                    </tem:ExecuteOperation>
                    </soapenv:Body>
                </soapenv:Envelope>`;
        return str;
    }    
}