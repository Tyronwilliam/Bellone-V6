import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card'

type CardCustomProps = {
  title?: string
  description?: string
  header?: React.ReactNode
  content?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function CardCustom({
  title,
  description,
  header,
  content,
  footer,
  children,
  className
}: CardCustomProps) {
  return (
    <Card className={className}>
      {(title || description || header) && (
        <CardHeader>
          {header}
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      {content && <CardContent>{content}</CardContent>}
      {children && !content && <CardContent>{children}</CardContent>}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}
