import { Component, OnInit } from '@angular/core';
import { LobBrokerService } from './lobbroker.service';
import { parseString } from 'xml2js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Lob Broker Service Console';
  country: string = "US";
  constructor(private lobBrokerService : LobBrokerService) {

  };
  operationNames:string[] = [];
  ngModelOperationName:string;
  ngModelOperationInput:string;
  ngModelOperationOutput:string;

  ngOnInit() {
    
    var operations:string[] = [];
    var _this = this;
    this.lobBrokerService.getOperations().subscribe((resp) => {
      var respText = resp.text();
      var start = respText.indexOf('<s:Envelope');
      var end = respText.indexOf('</s:Envelope>');
      
      var xmlString = respText.substring(start, end + '</s:Envelope>'.length);
      
      var onParse = (err, jsonObj) => {
        console.dir(jsonObj);
        var operArr = jsonObj['s:Envelope']['s:Body'][0]['GetOperationsResponse'][0]['GetOperationsResult'][0]['a:LOBBrokerRelayWebOperation_v15']
        
        for (let opeartionName of Object.values(operArr)) {  
          console.log(opeartionName);
          operations.push(opeartionName['a:Name']);
        }
      };

      parseString(xmlString, onParse);
      _this.operationNames = operations;
   },
   (err) => { 
              console.log(err);
              _this.ngModelOperationOutput = err;
            }, () => console.log('Complete'))
   };

   onRun() {
     var _this = this;
     var operInfo:string;
      this.lobBrokerService.runOperation(this.ngModelOperationName, this.ngModelOperationInput).subscribe((resp) => {
        var respText = resp.text();
        var start = respText.indexOf('<s:Envelope');
        var end = respText.indexOf('</s:Envelope>');
        
        var xmlString = respText.substring(start, end + '</s:Envelope>'.length);
        parseString(xmlString, (err, jsonObj) => {
          operInfo = jsonObj['s:Envelope']['s:Body'][0]['ExecuteOperationResponse'][0]['ExecuteOperationResult'][0];
        });
        _this.ngModelOperationOutput = operInfo;
      }, 
      (err) => {
                  console.log(err);
                  _this.ngModelOperationOutput = err;
      }, () => console.log('Complete'));
   }
}
