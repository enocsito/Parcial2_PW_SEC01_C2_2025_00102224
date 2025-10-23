import { cuentas } from '../data/cuentas.js';

const parseBalance = (balanceStr) => {
    const cleanedString = balanceStr.replace(/[$,]/g, '');
    return parseFloat(cleanedString);
};

export const handleGetCuentas = (req, res) => {
    const { _id, client, gender, isActive, balance} = req.query;

    if (Object.keys(req.query).length > 0) {
        let resultados = [];

        if (_id) {
            resultados = cuentas.filter(c => c._id === _id);
        } else if (client) {
            resultados = cuentas.filter(c => c.client.toLowerCase().includes(client.toLowerCase()));
        } else if (gender) {
            resultados = cuentas.filter(c => c.gender.toLowerCase() === gender.toLowerCase());
        } else if (isActive !== undefined) {
            const isActiveBool = (isActive === 'true');
            resultados = cuentas.filter(c => c.isActive === isActiveBool);
        } else if (balance) {
            const balanceValue = parseFloat(balance);
            resultados = cuentas.filter(c => parseBalance(c.balance) === balanceValue);
        } else {
            return res.status(400).json({ finded: false, message: "Parámetro de consulta no válido." });
        }

        if (resultados.length === 0) {
            return res.json({ finded: false });
        }
        if (resultados.length === 1) {
            return res.json({ finded: true, account: resultados[0] });
        }
        return res.json({ finded: true, data: resultados });
    }

    res.json({
        count: cuentas.length,
        data: cuentas
    });
};

export const getCuentaById = (req, res) => {
    const { id } = req.params;
    const cuenta = cuentas.find(c => c._id === id);

    if (cuenta) {
        res.json({
            finded: true,
            account: cuenta
        });
    } else {
        res.status(404).json({
            finded: false
        });
    }
};

export const getTotalBalance = (req, res) => {
    const cuentasActivas = cuentas.filter(c => c.isActive === true);

    if (cuentasActivas.length === 0) {
        return res.json({
            status: false,
            accountBalance: 0
        });
    }

    const totalBalance = cuentasActivas.reduce((acumulador, cuenta) => {
        return acumulador + parseBalance(cuenta.balance);
    }, 0);

    res.json({
        status: true,
        accountBalance: totalBalance
    });
};