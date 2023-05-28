<template>
  <div class="center">
    <div class="container">
      <div>
        <img
          src="https://static.wixstatic.com/media/dee6f2_f31f6417d75f4ac180d00607cab5d875~mv2.jpeg/v1/fill/w_57,h_57,q_85,usm_0.66_1.00_0.01/dee6f2_f31f6417d75f4ac180d00607cab5d875~mv2.jpeg"
          alt=""
          style="width: 4rem"
        />
      </div>
      <div>
        <h2 v-if="this.loading">cargando...</h2>
        <h3 style="padding-bottom: 0.5rem">Cantidad de USD que desea enviar</h3>
        <div>
          <input type="number" v-model="amount" />
        </div>
        <!-- <h3 style="padding-bottom: 0.5rem">
          Por favor ingresa la direccion de cartera del receptor
        </h3>
        <div>
          <input type="text" v-model="address" />
        </div> -->
        <div>
          <button class="generate_order" @click="this.validateAmount">
            Realizar pago
          </button>
        </div>
      </div>
    </div>
  </div>

  <!--  -->
  <div v-if="loading" class="modal-container">
    <div class="modal-content">
      <slot>Procesando transacción...</slot>
      <div class="spinner"></div>
    </div>
  </div>
  <!--  -->

  <div v-if="redirectPayPortal" class="modal-container">
    <div class="modal-content">
      <slot>Usted Será Redireccionado al portal de Pago</slot>
      <div class="spinner"></div>
    </div>
  </div>

  <div v-if="TransferSuccess" class="modal-container">
    <div class="modal-content">
      <slot>Transferencia Exitosa!</slot>
      <div></div>
    </div>
  </div>

  <!-- <div>
      <button @click="connectToServiceApi">Conectar al servicio web API</button>
      <button @click="connectToServiceApi2">Conectar al servicio web API2</button>
      <button @click="connectToService">Conectar al servicio web</button>
      <button @click="generatePayOrder">
        Conectar al servicio generatePayOrder
      </button>
    </div> -->
</template>

<script>
import axios from "axios";

export default {
  name: "PayOrder",
  data() {
    return {
      amount: "",
      address: "",
      loading: false,
      TransferSuccess: false,
      redirectPayPortal: false,

      tokenId: "",
    };
  },
  mounted() {
    if (this.$route.params.value && this.$route.params.ern_value) {
      console.log("parametro1", this.$route.params.value);
      console.log("parametro2", this.$route.params.ern_value);
    }
  },
  methods: {
    validateAmount() {
      this.amount == ""
        ? alert("Por favor ingrese un monto")
        : this.generatePayOrder();
    },
    generatePayOrder() {
      this.loading = true;
      const data = {
        amount: this.amount,
        receiverAddress: this.address,
      };
      axios
        .post("http://localhost:3000/generatePayOrder", data, {
          // .post("http://localhost:3000/transfer", data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((response) => {
          this.loading = false;
          this.redirectPayPortal = true;
          location.href = response.data;
        })
        .catch((error) => {
          console.log(error);
          alert(error.message);
        });
    },
    back() {
      location.reload();
    },
    //
    // connectToServiceApi(data) {
    //   axios
    //     .post("http://localhost:3000/generatePayOrder", data, {
    //       headers: {
    //         "Access-Control-Allow-Origin": "*",
    //       },
    //     })
    //     .then((response) => {
    //       console.log(response);
    //       location.href = response.data;
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       alert(error.message);
    //     });
    // },
    // connectToServiceApi2() {
    //   axios
    //     .post("http://localhost:3000/payOrder", {
    //       headers: {
    //         "Access-Control-Allow-Origin": "*",
    //       },
    //     })
    //     .then((response) => {
    //       console.log(response.data);
    //       window.open(response.data);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       alert(error.message);
    //     });
    // },
    // connectToService() {
    //   const uid = "68ec1cdde40ec70f28a0fb4b5874285f";
    //   const wsk = "888a21750f7417a11569b326b848dc1a";
    //   const format_return = "xml";

    //   const soapMessage = `
    //     <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wspg="urn:wspg">
    //       <soapenv:Header/>
    //       <soapenv:Body>
    //         <wspg:connect>
    //           <uid>${uid}</uid>
    //           <wsk>${wsk}</wsk>
    //           <format_return>${format_return}</format_return>
    //         </wspg:connect>
    //       </soapenv:Body>
    //     </soapenv:Envelope>
    //   `;

    //   axios({
    //     method: "post",
    //     url: "https://sandbox.pagadito.com/comercios/wspg/charges.php",
    //     headers: {
    //       "Content-Type": "text/xml;charset=UTF-8",
    //       // SOAPAction: "urn:ws#connect",
    //     },
    //     data: soapMessage,
    //   })
    //     .then((response) => {
    //       // Analizar la respuesta XML utilizando DOMParser
    //       const parser = new DOMParser();
    //       const xmlDoc = parser.parseFromString(response.data, "text/xml");
    //       const result = this.xmlToJson(xmlDoc);
    //       const xmlResult =
    //         result["SOAP-ENV:Envelope"]["SOAP-ENV:Envelope"]["SOAP-ENV:Body"][
    //           "ns1:connectResponse"
    //         ].return;
    //       const xmlData = parser.parseFromString(xmlResult, "text/xml");
    //       const serviceResponse = this.xmlToJson(xmlData);
    //       // Hacer algo con la respuesta del servicio web
    //       console.log("aqui tienes el resultado2", result);
    //       console.log("porfa", xmlResult);
    //       console.log("serviceResponse", serviceResponse.response.response);
    //       this.tokenId = serviceResponse.response.response.value;
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // },
    // // Función para convertir un documento XML a un objeto JSON
    // xmlToJson(xml) {
    //   // Convierte un nodo XML a un objeto JSON
    //   function nodeToJson(node) {
    //     const obj = {};
    //     obj[node.nodeName] = {};
    //     // Agrega los atributos del nodo al objeto JSON
    //     if (node.attributes?.length > 0) {
    //       for (let i = 0; i < node.attributes.length; i++) {
    //         const attribute = node.attributes.item(i);
    //         obj[node.nodeName][attribute.nodeName] = attribute.nodeValue;
    //       }
    //     }
    //     // Agrega los hijos del nodo al objeto JSON
    //     if (node.childNodes?.length > 0) {
    //       for (let i = 0; i < node.childNodes.length; i++) {
    //         const childNode = node.childNodes.item(i);
    //         if (childNode.nodeType === 1) {
    //           // Si el hijo es un nodo XML, lo convierte a un objeto JSON recursivamente
    //           const childObj = nodeToJson(childNode);
    //           if (obj[node.nodeName][childNode.nodeName] === undefined) {
    //             obj[node.nodeName][childNode.nodeName] =
    //               childObj[childNode.nodeName];
    //           } else {
    //             if (Array.isArray(obj[node.nodeName][childNode.nodeName])) {
    //               obj[node.nodeName][childNode.nodeName].push(
    //                 childObj[childNode.nodeName]
    //               );
    //             } else {
    //               obj[node.nodeName][childNode.nodeName] = [
    //                 obj[node.nodeName][childNode.nodeName],
    //                 childObj[childNode.nodeName],
    //               ];
    //             }
    //           }
    //         } else if (childNode.nodeType === 3) {
    //           // Si el hijo es un nodo de texto, agrega su valor al objeto JSON
    //           obj[node.nodeName] = childNode.nodeValue.trim();
    //         }
    //       }
    //     }
    //     return obj;
    //   }
    //   // Convierte el documento XML completo a un objeto JSON
    //   const result = {};
    //   result[xml.documentElement.nodeName] = nodeToJson(xml.documentElement);
    //   return result;
    // },
    // //
    // generatePayOrder() {
    //   const uid = "68ec1cdde40ec70f28a0fb4b5874285f";
    //   const wsk = "888a21750f7417a11569b326b848dc1a";
    //   const format_return = "xml";

    //   const soapMessage = `
    //     <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wspg="urn:wspg">
    //       <soapenv:Header/>
    //       <soapenv:Body>
    //         <wspg:exec_trans>
    //           <token>${this.tokenId}</token>
    //           <ern>33</ern>
    //           <amount>2</amount>
    //           <details>
    //             <![CDATA[
    //             <detail>
    //               <quantity>1</quantity>
    //               <description>Producto Z</description>
    //               <price>2</price>
    //               <url_product>http://www.mi.com</url_product>
    //             </detail>
    //           ]]>
    //           </details>
    //           <format_return>${format_return}</format_return>
    //           <currency>USD</currency>
    //         </wspg:exec_trans>
    //       </soapenv:Body>
    //     </soapenv:Envelope>
    //   `;

    //   axios({
    //     method: "post",
    //     url: "https://sandbox.pagadito.com/comercios/wspg/charges.php",
    //     headers: {
    //       "Content-Type": "text/xml;charset=UTF-8",
    //       // SOAPAction: "urn:ws#connect",
    //     },
    //     data: soapMessage,
    //   })
    //     .then((response) => {
    //       // Analizar la respuesta XML utilizando DOMParser
    //       const parser = new DOMParser();
    //       const xmlDoc = parser.parseFromString(response.data, "text/xml");
    //       const result = this.xmlToJson(xmlDoc);
    //       const xmlResult =
    //         result["SOAP-ENV:Envelope"]["SOAP-ENV:Envelope"]["SOAP-ENV:Body"][
    //           "ns1:exec_transResponse"
    //         ].return;
    //       const xmlData = parser.parseFromString(xmlResult, "text/xml");
    //       const serviceResponse = this.xmlToJson(xmlData);
    //       // Hacer algo con la respuesta del servicio web
    //       console.log("aqui tienes el resultado2", result);
    //       console.log("porfa", xmlResult);
    //       console.log("xmlData", xmlData);
    //       console.log("serviceResponse", serviceResponse.response.response);
    //       console.log(
    //         "decodeURL",
    //         decodeURIComponent(serviceResponse.response.response.value)
    //       );
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // },
  },
  computed: {},
};
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
.container {
  border: 0.3rem solid;
  border-radius: 10px;
  border-color: white;
  background-color: white;
  width: 35rem;
  margin: 0 auto;
}
.back-arrow {
  border: 0px solid;
  background-color: white;
  color: #f0b90b;

  font-size: 3rem;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  font-weight: bold;
  float: left;
}

a {
  color: #f0b90b;
}
input {
  margin-bottom: 1rem;
  height: 2rem;
  border-radius: 0.4rem;
  font-size: 1rem;
  font-weight: bold;
}

h2 {
  margin: 0.5rem;
}
h3 {
  margin: 1rem;
}
button {
  margin-bottom: 1rem;
  cursor: pointer;
}

.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
}
.generate_order {
  height: 2rem;
  border-radius: 0.4rem;
  border-color: transparent;
  background-color: rgb(238, 117, 24);

  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  color: white;
  font-size: 1rem;
  font-weight: bold;
}

.spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
