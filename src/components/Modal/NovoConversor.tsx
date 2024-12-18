import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import TextareaWithCounter from "../ContadorCaracteres";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hook/Auth";
import { createNewConversor } from "@/interface/auth";
import { useState } from "react";

const verifyCreateConversor = z.object({
  name: z.string().min(4, "*Mínimo de 4 caracteres."),
  characters: z.string().min(8, "*Mínimo de 8 caracteres."),
});

type conversorData = z.infer<typeof verifyCreateConversor>;
type HandleCreateUsersProps = {
  handleCreateConversor: ({ name, characters }: createNewConversor) => void;
};

type createConversorProps = {
  onCreateConversor: () => void;
};

export function NovoConversor({ onCreateConversor }: createConversorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { handleCreateConversor } = useAuth() as HandleCreateUsersProps;
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<conversorData>({
    resolver: zodResolver(verifyCreateConversor),
    defaultValues: {
      name: "",
      characters: "",
    },
  });

  async function createConversor(data: conversorData) {
    const { name, characters } = data;
    console.log(data);
    try {
      await handleCreateConversor({ name, characters });
      onCreateConversor();
      setIsOpen(false);
      reset();
    } catch (error) {
      console.log("Erro ao criar conversor", error);
    }
  }

  const charactersValue = watch("characters");
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" variant={"secondary"}>
          <Plus size={18} />
          Novo Conversor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pb-4 border-b-[1px]">
          <DialogTitle>Novo Conversor</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(createConversor)}>
          <div className="grid grid-cols-4 gap-4 gap-y-6 py-4">

            <div className="relative col-span-4">
              <Label htmlFor="characters" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">
                Conversor
              </Label>
              <TextareaWithCounter
                maxLength={999}
                value={charactersValue}
                onChange={(e) => {
                  setValue("characters", e.target.value);
                }}
              />
              {errors.characters && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.characters.message}
                </span>
              )}
            </div>

            <div className="relative col-span-4">
              <Label className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">Título</Label>
              <Input
                type="text"
                placeholder="..."
                {...register("name")}
                className={`${errors.name && "border-rose-400"}`}
              />
              {errors.name && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.name.message}
                </span>
              )}
            </div>

          </div>
          <DialogFooter>
            <Button
              className="flex items-center gap-2"
              type="submit"
              variant={"secondary"}
              onClick={() => setIsOpen(true)}
            >
              <Plus size={18} />
              Criar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
