import { useState } from "react";
import { toast } from "sonner";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChartContainer } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Pagination, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const demoFormSchema = { name: "" };

export default function UIDemo() {
  const [progress] = useState(34);
  const [slider, setSlider] = useState([50]);
  const [toggle, setToggle] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [radio, setRadio] = useState("a");
  const [otp, setOtp] = useState("123456");



  return (
    <div className="container mx-auto p-6 space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold">UI Components Demo</h1>
        <p className="mt-2 text-muted-foreground">A practical page to ensure shadcn components are wired across the site.</p>
      </div>

      <section className="space-y-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Accordion</AccordionTrigger>
            <AccordionContent>Accessible collapsible content.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Components are rendered here to validate usage end-to-end.</AlertDescription>
      </Alert>

      <section className="grid gap-4 md:grid-cols-2">
        <AspectRatio ratio={16 / 9}>
          <div className="flex items-center justify-center bg-muted">16:9</div>
        </AspectRatio>
        <div className="flex gap-4 items-center">
          <Avatar>
            <AvatarImage src="/hero.png" />
            <AvatarFallback>W</AvatarFallback>
          </Avatar>
          <div>
            <Badge variant="default">Default Badge</Badge>
            <Badge variant="secondary" className="ml-2">Secondary</Badge>
          </div>
        </div>
      </section>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>UIDemo</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toast.success("Button works")}>Default</Button>
        <Button variant="outline" onClick={() => toast.message("Outline")}>Outline</Button>
        <Button variant="destructive" onClick={() => toast.error("Destructive")}>Destructive</Button>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={new Date()} onSelect={() => {}} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Carousel</CardTitle>
          </CardHeader>
          <CardContent>
            <Carousel>
              <CarouselContent>
                <CarouselItem className="basis-1/2">Slide 1</CarouselItem>
                <CarouselItem className="basis-1/2">Slide 2</CarouselItem>
                <CarouselItem className="basis-1/2">Slide 3</CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      </section>

      <ChartContainer config={{}}>
        <div className="h-40 flex items-center justify-center text-muted-foreground">Chart area (demo)</div>

      </ChartContainer>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex items-center gap-2">
          <Checkbox checked={checkbox} onCheckedChange={(v) => setCheckbox(!!v)} />
          Checkbox
        </label>

        <Collapsible>
          <CollapsibleTrigger className="text-blue-600 font-semibold">Collapsible</CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 text-sm text-muted-foreground">Shown inside Collapsible.</div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Command>
        <CommandInput placeholder="Type to search" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Components">
            <CommandItem onSelect={() => toast.message("CommandItem clicked")}>Calendar</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog</DialogTitle>
            <DialogDescription>Shadcn dialog demo.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Open Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 text-sm text-muted-foreground">Drawer content</div>
        </DrawerContent>
      </Drawer>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Dropdown</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => toast.success("Dropdown item")}>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Form (minimal demo) */}
      <Form {...(demoFormSchema as any)}>
        <form
          className="space-y-4 max-w-xl"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Form submit (demo)");
          }}
        >
          <div>
            <Label>Name</Label>
            <Input placeholder="Your name" className="mt-1" />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <InputOTP maxLength={6} value={otp} onChange={(v) => setOtp(v)}>
        <InputOTPGroup>
          {Array.from({ length: 6 }).map((_, idx) => (
            <InputOTPSlot key={idx} index={idx} />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => toast.message("New")}>New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="#">Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <Pagination>
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </Pagination>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent className="p-3 text-sm">Popover content</PopoverContent>
      </Popover>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm font-semibold">{progress}%</span>
        </div>
        <Progress value={progress} />
        <div className="mt-3">
          <Slider value={slider} max={100} step={1} onValueChange={setSlider} />
          <div className="mt-2 text-xs text-muted-foreground">Slider value: {slider[0]}</div>
        </div>
      </div>

      <RadioGroup value={radio} onValueChange={setRadio}>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="a" id="a" />
          <Label htmlFor="a">Option A</Label>
        </div>
      </RadioGroup>

      <ResizablePanelGroup className="border rounded-2xl" style={{ flexDirection: "row" }}>
        <ResizablePanel defaultSize={50}>
          <div className="p-4 text-sm text-muted-foreground">Panel 1</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div className="p-4 text-sm text-muted-foreground">Panel 2</div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <ScrollArea className="h-24 border rounded-2xl">
        <div className="p-4 text-sm">ScrollArea demo content... scroll me</div>
      </ScrollArea>

      <Select>
        <SelectTrigger className="w-full max-w-xs">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
        </SelectContent>
      </Select>

      <Separator />

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open Sheet</Button>
        </SheetTrigger>
        <SheetContent>Sheet demo</SheetContent>
      </Sheet>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-7">
            <h3 className="font-display text-2xl font-semibold">Tabs</h3>
            <Tabs defaultValue="tab1" className="mt-4">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">Tab 1 content</TabsContent>
              <TabsContent value="tab2">Tab 2 content</TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Toggle pressed={toggle} onPressedChange={setToggle}>
            Toggle
          </Toggle>

          <ToggleGroup type="single" value={"a"} onValueChange={() => {}}>
            <ToggleGroupItem value="a">A</ToggleGroupItem>
            <ToggleGroupItem value="b">B</ToggleGroupItem>
          </ToggleGroup>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>Tooltip</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Textarea placeholder="Textarea" />
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={checkbox} onCheckedChange={(v) => setCheckbox(!!v)} />
          <div>
            <div className="font-semibold">Switch</div>
            <div className="text-xs text-muted-foreground">Wired toggle</div>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Warren</TableCell>
            <TableCell>
              <Badge>Active</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div>
        <div className="mb-2 text-sm font-semibold">Skeleton</div>
        <Skeleton className="h-10 w-full rounded-2xl" />
      </div>

      <Toaster />
    </div>
  );
}

