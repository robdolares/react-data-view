import { Label, LabelGroup, Split, SplitItem } from '@patternfly/react-core'
import { DateTime } from 'luxon'
import { Fragment, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { IconWrapper } from './components/IconWrapper'

type CellFn<T extends object> = (item: T) => ReactNode

export interface ITableColumn<T extends object> {
    header: string
    cell: CellFn<T>
    minWidth?: number
    type?: 'labels' | 'progress' | 'date'
    enabled?: boolean
    sortFn?: (l: T, r: T) => number
}

export function Labels(props: { labels: string[] }) {
    return (
        <LabelGroup numLabels={999} isCompact>
            {props.labels.map((label) => (
                <Label isCompact key={label}>
                    {label}
                </Label>
            ))}
        </LabelGroup>
    )
}

export function DateCell(props: { value: number | string }) {
    const date = new Date(props.value)
    return (
        <Split hasGutter>
            <SplitItem>{date.toLocaleDateString()}</SplitItem>
            <SplitItem>{date.toLocaleTimeString()}</SplitItem>
        </Split>
    )
}

export function TextCell(props: { icon?: ReactNode; text: string; iconSize?: 'sm' | 'md' | 'lg'; to?: string }) {
    return (
        <Split>
            {props.icon && (
                <SplitItem>
                    <IconWrapper size={props.iconSize ?? 'md'}>{props.icon}</IconWrapper>
                </SplitItem>
            )}
            {props.to ? (
                <SplitItem>
                    <Link to={props.to}>{props.text}</Link>
                </SplitItem>
            ) : (
                <SplitItem>{props.text}</SplitItem>
            )}
        </Split>
    )
}

export function SinceCell(props: { value: string }) {
    const dateTime = DateTime.fromISO(props.value)
    return <Fragment>{dateTime.toRelative()}</Fragment>
}
