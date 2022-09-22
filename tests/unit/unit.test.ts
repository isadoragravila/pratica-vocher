import voucherService from "../../src/services/voucherService";
import voucherRepository from "../../src/repositories/voucherRepository";
import * as voucherFactory from "../factories/voucherFactory";
import { conflictError } from '../../src/utils/errorUtils';

describe('Testa criação do voucher', () => {
    it('Testa se voucher é criado corretamente', async () => {
        const voucher = await voucherFactory.voucherBody();

        jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(null);

        jest.spyOn(voucherRepository, "createVoucher");

        await voucherService.createVoucher(voucher.code, voucher.discount);

        expect(voucherRepository.createVoucher).toBeCalledTimes(1);
    });
    it('Testa se retorna erro quando voucher já é existente', async () => {
        const voucher = await voucherFactory.voucherData();
        
        jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);

        const result = voucherService.createVoucher(voucher.code, voucher.discount);

        expect(result).rejects.toEqual(conflictError("Voucher already exist."));
    });
});

describe('Testa aplicação do voucher', () => {
    it('Testa se voucher não existe', async () => {
        const voucher = await voucherFactory.voucherData();
        const amount = await voucherFactory.amountBiggerThan100();

        jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(null);

        const result = voucherService.applyVoucher(voucher.code, amount);

        expect(result).rejects.toEqual(conflictError('Voucher does not exist.'));
    });

    it('Se voucher existe, valor é maior que 100, e voucher é válido, retorna valor com desconto', async () => {
        const voucher = await voucherFactory.voucherData();
        const amount = await voucherFactory.amountBiggerThan100();
        const usedVoucher = { ...voucher, used: true };

        jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);

        jest.spyOn(voucherRepository, "useVoucher").mockResolvedValueOnce(usedVoucher);

        const result = await voucherService.applyVoucher(voucher.code, amount);

        expect(result).toEqual({
            amount: amount,
            discount: voucher.discount,
            finalAmount: amount - amount * (voucher.discount/100),
            applied: true
        });
    });

    it('Se voucher existe, valor é menor que 100, e voucher é válido, retorna valor sem desconto', async () => {
        const voucher = await voucherFactory.voucherData();
        const amount = await voucherFactory.amountLowerThan100();
        const usedVoucher = { ...voucher, used: true };

        jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);

        jest.spyOn(voucherRepository, "useVoucher").mockResolvedValueOnce(usedVoucher);

        const result = await voucherService.applyVoucher(voucher.code, amount);

        expect(result).toEqual({
            amount: amount,
            discount: voucher.discount,
            finalAmount: amount,
            applied: false
        });
    });

    it('Se voucher existe, valor é maior que 100, e voucher não é válido, retorna valor sem desconto', async () => {
        const voucher = await voucherFactory.usedVoucherData();
        const amount = await voucherFactory.amountBiggerThan100();

        jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);

        const result = await voucherService.applyVoucher(voucher.code, amount);

        expect(result).toEqual({
            amount: amount,
            discount: voucher.discount,
            finalAmount: amount,
            applied: false
        });
    });

});