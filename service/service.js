class Service {

    formatarData(data) {
        let dataFormatada = `${data.slice(8)}-${data.slice(5, 7)}-${data.slice(0, 4)}`
        return dataFormatada
    }

    dataVencimento(dataPagamento) {

    }

}

module.exports = new Service();