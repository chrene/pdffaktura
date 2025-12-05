import { yupResolver } from "@hookform/resolvers/yup";
import classNames from "classnames";
import { useFieldArray, useForm } from "react-hook-form";
import { InvoiceData } from "../../../types/invoice-data";
import { getCompanyByVAT } from "../../services/cvr-api";
import { dxFactory } from "../../services/dx-factory";
import Button from "../button";
import { FlexContainer } from "../flex-container";
import FormInput from "../form-input";
import FormInputCheckbox from "../form-input-checkbox";
import { CloseIcon, DownloadIcon } from "../icon";
import { defaultFormValues } from "./default-form-values";
import { FormGroup } from "./form-group";
import { validationSchema } from "./form-validation";
import { InvoiceSection } from "./invoice-section";

interface CreateInvoiceFormProps {
  dx?: { enabled: boolean };
}

export const CreateInvoiceForm = ({ dx }: CreateInvoiceFormProps) => {
  const resolver = yupResolver(validationSchema);
  const {
    control,
    register,
    getValues,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValues,
    resolver,
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "lines",
  });
  const watchIsCompany = watch("receiver.isCompany");
  const handleDownloadInvoicePDF = async (data: InvoiceData) => {
    // make a post request to download PDF and save as file from /api/invoices
    const response = await fetch("/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.blob());

    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(response);
    a.download = `${data.invoice.number}`;
    a.click();
    a.remove();
  };

  const handleFetchSenderCompany = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await getCompanyByVAT(getValues().sender.vat);
    reset({
      ...getValues(),
      sender: {
        ...getValues().sender,
        name: result.name,
        address: `${result.address} ${
          result.addressco ? `c/o ${result.addressco} ` : ""
        }`.trim(),
        zipcode: result.zipcode,
        city: result.city,
        phone: result.phone,
        email: result.email,
      },
    });
  };

  const handleFetchReceiverCompany = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await getCompanyByVAT(getValues().receiver.vat);
    reset({
      ...getValues(),
      receiver: {
        ...getValues().receiver,
        name: result.name,
        address: result.address,
        zipcode: result.zipcode,
        city: result.city,
      },
    });
  };

  const onFormSubmit = async (data) => {
    await handleDownloadInvoicePDF(data);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {dx?.enabled && (
        <button
          className="btn btn-primary btn-outline fixed bottom-4 right-4"
          onClick={() => {
            const data = dxFactory.invoice.create();
            reset(data);
          }}
        >
          Udfyld test data
        </button>
      )}

      <div className="shadow-2xl shadow-black/15 bg-base-100 mx-auto rounded-2xl mt-8 lg:mt-16 lg:mx-auto py-8 p-5 lg:p-16 lg:max-w-5xl relative">
        <FlexContainer dividers>
          <InvoiceSection title="Fakturalinjer">
            <ul className="gap-4 flex flex-col relative">
              {fields.length > 0 ? (
                fields.map((item, index) => {
                  return (
                    <li
                      className="grid grid-cols-12 pt-8 first:pt-0 xl:p-0 mb-4 xl:mb-0 gap-4 xl:gap-8 relative"
                      key={item.id}
                    >
                      <FormInput
                        className="col-span-12 xl:col-span-7"
                        type="text"
                        label="Beskrivelse"
                        placeholder="Beskrivelse"
                        errors={errors}
                        register={{
                          ...register(`lines.${index}.description`),
                        }}
                      />
                      <FormInput
                        className="col-span-6 xl:col-span-2"
                        type="number"
                        label="Antal"
                        errors={errors}
                        register={{
                          ...register(`lines.${index}.quantity`),
                        }}
                      />
                      <FormInput
                        className="col-span-6 xl:col-span-2"
                        type="number"
                        label="Enhedspris"
                        errors={errors}
                        register={{
                          ...register(`lines.${index}.price`),
                        }}
                      />

                      <button
                        className={classNames(
                          `btn btn-circle btn-error btn-link btn-xs set-fill text-neutral self-center xl:mt-10 top-4 xl:top-0 right-0 absolute xl:relative xl:col-span-1`,
                          {
                            hidden: index === 0,
                          }
                        )}
                        onClick={() => remove(index)}
                      >
                        <CloseIcon />
                      </button>
                    </li>
                  );
                })
              ) : (
                <div className="text-center">Ingen fakturalinjer</div>
              )}
            </ul>
            <div className="w-fit self-center">
              <Button
                ghost
                onClick={() =>
                  append({ description: "", quantity: null, price: null })
                }
              >
                Tilføj ny linje
              </Button>
            </div>
          </InvoiceSection>

          {/* Sender */}
          <InvoiceSection title="Afsender">
            <FlexContainer>
              <FormGroup cols>
                <FormInput
                  className="col-span-6"
                  placeholder="CVR"
                  label="CVR"
                  errors={errors}
                  register={{
                    ...register("sender.vat", {
                      required: true,
                      minLength: 8,
                    }),
                  }}
                />
                <Button
                  primary
                  className="self-end col-span-6 w-fit px-6"
                  onClick={handleFetchSenderCompany}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Hent data
                </Button>
              </FormGroup>
            </FlexContainer>
            <FlexContainer>
              <FormGroup cols>
                <FormInput
                  className="col-span-12 lg:col-span-6"
                  placeholder="Navn"
                  label="Navn"
                  errors={errors}
                  register={{ ...register("sender.name") }}
                />
                <FormInput
                  className="col-span-12 lg:col-span-6"
                  placeholder="Adresse"
                  label="Adresse"
                  errors={errors}
                  register={{ ...register("sender.address") }}
                />
              </FormGroup>
              <FormGroup cols>
                <FormInput
                  className="col-span-12 lg:col-span-6"
                  placeholder="Postnummer"
                  label="Postnummer"
                  errors={errors}
                  register={{ ...register("sender.zipcode") }}
                />
                <FormInput
                  className="col-span-12 lg:col-span-6"
                  placeholder="By"
                  label="By"
                  errors={errors}
                  register={{ ...register("sender.city") }}
                />
              </FormGroup>
              <FormGroup cols>
                <FormInput
                  className="col-span-12 lg:col-span-6"
                  placeholder="Email"
                  label="Email"
                  errors={errors}
                  register={{ ...register("sender.email") }}
                />
                <FormInput
                  className="col-span-12 lg:col-span-6"
                  placeholder="Telefon"
                  label="Telefon"
                  errors={errors}
                  register={{
                    ...register("sender.phone", {
                      required: false,
                    }),
                  }}
                />
              </FormGroup>
            </FlexContainer>
          </InvoiceSection>

          {/* Receiver */}
          <InvoiceSection title="Modtager">
            <FormGroup cols>
              <FormInputCheckbox
                label="Modtager er en virksomhed"
                register={{ ...register("receiver.isCompany") }}
              />
            </FormGroup>
            {watchIsCompany ? (
              <FormGroup cols>
                <FormInput
                  className="col-span-6"
                  placeholder="CVR"
                  label="CVR"
                  errors={errors}
                  register={{ ...register("receiver.vat") }}
                />
                <Button
                  primary
                  className="col-span-6 w-fit px-6 self-end"
                  onClick={(e) => handleFetchReceiverCompany(e)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Hent data
                </Button>
              </FormGroup>
            ) : null}
            <FlexContainer>
              <FormGroup cols>
                <FormInput
                  className="col-span-12 lg:col-span-6"
                  placeholder="Navn"
                  label="Navn"
                  errors={errors}
                  register={{ ...register("receiver.name") }}
                />
                <FormInput
                  className="col-span-12 lg:col-span-6"
                  placeholder="Adresse"
                  label="Adresse"
                  errors={errors}
                  register={{ ...register("receiver.address") }}
                />
              </FormGroup>
              <FormGroup cols>
                <FormInput
                  className="col-span-4 lg:col-span-6"
                  placeholder="Postnr."
                  label="Postnr."
                  errors={errors}
                  register={{ ...register("receiver.zipcode") }}
                />
                <FormInput
                  className="col-span-8 lg:col-span-6"
                  placeholder="By"
                  label="By"
                  errors={errors}
                  register={{ ...register("receiver.city") }}
                />
              </FormGroup>
            </FlexContainer>
          </InvoiceSection>

          {/* Invoice info */}
          <InvoiceSection title="Fakturaoplysninger">
            <FormGroup cols>
              <FormInput
                className="col-span-12 lg:col-span-4"
                placeholder="Fakturanummer"
                label="Fakturanummer"
                errors={errors}
                register={{ ...register("invoice.number") }}
              />
              <FormInput
                className="col-span-6 lg:col-span-4"
                type="date"
                placeholder="Fakturadato"
                label="Fakturadato"
                errors={errors}
                register={{ ...register("invoice.date") }}
              />
              <FormInput
                className="col-span-6 lg:col-span-4"
                type="date"
                placeholder="Betalingsdato"
                label="Betalingsdato"
                errors={errors}
                register={{ ...register("invoice.due") }}
              />
            </FormGroup>
            <FormGroup cols>
              <FormInput
                className="col-span-12 lg:col-span-4"
                placeholder="1234"
                label="Bank registreringsnummer"
                errors={errors}
                register={{ ...register("invoice.bankRegistrationNumber") }}
              />
              <FormInput
                className="col-span-12 lg:col-span-8"
                placeholder="12345678"
                label="Bank kontonummer"
                errors={errors}
                register={{ ...register("invoice.bankAccountNumber") }}
              />
            </FormGroup>

            <FormGroup cols>
              <FormInputCheckbox
                label="Sen betalingsgebyr"
                register={{ ...register("lateFee") }}
              />
            </FormGroup>
            <FormGroup cols>
              <FormInputCheckbox
                label="Tilføj moms"
                register={{ ...register("addTax") }}
              />
            </FormGroup>
          </InvoiceSection>
          {/* Download */}
          <InvoiceSection title="Hent faktura">
            <FormGroup cols>
              <Button
                primary
                onClick={handleSubmit(onFormSubmit)}
                className="col-span-12 w-fit px-6"
              >
                <DownloadIcon />
                Download PDF
              </Button>
            </FormGroup>
          </InvoiceSection>
        </FlexContainer>
      </div>
    </form>
  );
};
