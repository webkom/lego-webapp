import { describe, it, expect } from 'vitest';
import { createAsyncValidator } from 'app/utils/asyncValidator';

describe('asyncValidator', () => {
  it('should validate a text field', async () => {
    const asyncValidate = createAsyncValidator({
      field1: [
        (value) => {
          return new Promise((resolve) => {
            if (value === 'success') {
              resolve([true]);
            } else {
              resolve([false, 'value was not success']);
            }
          });
        },
      ],
    });
    await expect(
      asyncValidate({
        field1: 'success',
      })
    ).resolves.toBeUndefined();
    await expect(
      asyncValidate({
        field1: 'failure',
      })
    ).rejects.toStrictEqual({
      field1: ['value was not success'],
    });
  });
  it('should show errors on multiple fields', async () => {
    const asyncValidate = createAsyncValidator({
      field1: [
        (value) => {
          return new Promise((resolve) => {
            if (value === 'success') {
              resolve([true]);
            } else {
              resolve([false, 'value was not success']);
            }
          });
        },
      ],
      field2: [
        (value, formData) => {
          return new Promise((resolve) => {
            if (value === formData.field1) {
              resolve([true]);
            } else {
              resolve([false, 'value was not equal to field1']);
            }
          });
        },
      ],
    });
    await expect(
      asyncValidate({
        field1: 'success',
        field2: 'success',
      })
    ).resolves.toBeUndefined();
    await expect(
      asyncValidate({
        field1: 'failure',
        field2: 'failure',
      })
    ).rejects.toStrictEqual({
      field1: ['value was not success'],
    });
    await expect(
      asyncValidate({
        field1: 'failure',
        field2: 'other',
      })
    ).rejects.toStrictEqual({
      field1: ['value was not success'],
      field2: ['value was not equal to field1'],
    });
  });
});
