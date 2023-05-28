<template>
  <div class="center">
    <div class="container">
      <div v-if="this.qr_code == ''">
        <h2 v-if="this.loading">cargando...</h2>
        <h3 style="padding-bottom: 0.5rem">
          Por favor ingresa el monto en Dolares que deseas pagar
        </h3>
        <div>
          <input type="number" v-model="amount" />
        </div>
        <div>
          <button class="generate_order" @click="this.validetAmount">
            Generar Orden
          </button>
        </div>
      </div>

      <div v-if="this.qr_code">
        <div>
          <button class="back-arrow" @click="back()">&larr;</button>
        </div>
        <div style="clear: both">
          <h2 style="margin-bottom: 1rem">
            ¡¡Orden de Pago Generada con Exito!!
          </h2>
          <h2>Puedes escanear este QR</h2>
          <img
            style="width: 20rem"
            :src="this.qr_code"
            alt="Codigo de orden de Pago"
          />
          <h4>
            O hacer click para redirigirte al portal de pagos
            <a :href="this.payment_url">AQUI</a>
          </h4>
        </div>
      </div>
    </div>
  </div>

  <!--  -->
  <div v-if="loading" class="modal-container">
    <div class="modal-content">
      <slot>Generando orden de pago...</slot>
      <div class="spinner"></div>
    </div>
  </div>
  <!--  -->
</template>

<script>
import axios from "axios";

export default {
  name: "BinancePay",
  data() {
    return {
      amount: "",
      qr_code: "",
      payment_url: "",
      loading: false,
    };
  },

  methods: {
    validetAmount() {
      this.amount == ""
        ? alert("Por favor ingrese un monto")
        : this.generatePayOrder();
    },
    generatePayOrder() {
      this.loading = true;
      axios
        .get(
          `https://api-binance-server.onrender.com/createOrder/${this.amount}`,
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((response) => {
          this.qr_code = response.data.data.qrcodeLink;
          this.payment_url = response.data.data.universalUrl;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          alert(error.message);
        });
    },
    back() {
      location.reload();
    },
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
  width: 30rem;
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
  background-color: #f0b90b;

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
