<template>
  <!-- <div class="center">
    <div class="container"></div>
  </div> -->

  <!--  -->
  <div v-if="loading" class="modal-container">
    <div class="modal-content">
      <h3>Procesando transacción...</h3>
      <div class="spinner"></div>
    </div>
  </div>
  <!--  -->

  <div v-if="TransferSuccess" class="modal-container">
    <div class="modal-content">
      <h3>Transferencia Exitosa!</h3>
      <div>
        <button class="button-final" @click="home()">Gracias</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Transfer",
  data() {
    return {
      loading: false,
      TransferSuccess: false,
      redirectPayPortal: false,
    };
  },
  mounted() {
    if (this.$route.params.value && this.$route.params.ern_value) {
      console.log("parametro1", this.$route.params.value);
      console.log("parametro2", this.$route.params.ern_value);
      this.validatePayOrder();
    }
  },
  methods: {
    validatePayOrder() {
      this.loading = true;
      const data = {
        value: this.$route.params.value,
        ern_value: this.$route.params.ern_value,
      };
      axios
        .post("http://localhost:3000/validatePayOrder", data, {
          // .post("http://localhost:3000/transfer", data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((response) => {
          // this.loading = false;
          this.TransferSuccess = true;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          alert(error.message);
        });
    },
    home() {
      location.href = "/";
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
.button-final {
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
