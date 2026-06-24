'use client'

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    Menu,
    X,
    Trophy,
    Calendar,
    Users,
    Home
} from 'lucide-react'

import logo from "../../assets/images/topfoot.png"
import { useSwitch } from '../../context/SwitchContext'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { enabled, toggle,disabled } = useSwitch()
    const location = useLocation()

    const navLinks = [
        {
            href: '/',
            label: 'Accueil',
            icon: Home,
        },
        {
            href: '/matchs',
            label: 'Matchs',
            icon: Calendar,
        },
        {
            href: '/equipes',
            label: 'Équipes',
            icon: Users,
        },
        {
            href: '/classement',
            label: 'Classement',
            icon: Trophy,
        },
    ]

    const isActiveLink = (href) => {
        if (href === '/') {
            return location.pathname === '/'
        }

        return location.pathname.startsWith(href)
    }

    return (
        <nav className="fixed top-0 z-[999] w-full bg-gray-900 text-white shadow-lg">
            <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                            <img
                                src={logo}
                                alt="TopFoot"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <Link
                            to="/"
                            className="hidden sm:block text-lg font-bold"
                        >
                            TopFoot
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => {
                            const Icon = link.icon
                            const isActive = isActiveLink(link.href)

                            return (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200
                                        ${
                                            isActive
                                                ? 'bg-emerald-600 text-white'
                                                : 'hover:bg-white/10'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{link.label}</span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Switch */}
                  {!disabled && (  <div className="hidden sm:flex items-center gap-3">
                        <span className="text-sm font-medium">
                            Évènement
                        </span>

                        <button
                            onClick={toggle}
                            className={`relative inline-flex h-6 w-14 items-center rounded-full transition-colors duration-300 ${
                                enabled
                                    ? 'bg-emerald-600'
                                    : 'bg-slate-300'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-300 ${
                                    enabled
                                        ? 'translate-x-9'
                                        : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>)}

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden rounded-md p-2 hover:bg-white/10 transition-colors"
                    >
                        {isOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden border-t border-white/10">
                        <div className="space-y-1 py-3">

                            {navLinks.map((link) => {
                                const Icon = link.icon
                                const isActive = isActiveLink(link.href)

                                return (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium transition-colors
                                            ${
                                                isActive
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'hover:bg-white/10'
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{link.label}</span>
                                    </Link>
                                )
                            })}

                            <div className="flex items-center justify-between px-3 pt-4 border-t border-white/10">
                                <span>Évènement</span>

                                <button
                                    onClick={toggle}
                                    className={`relative inline-flex h-6 w-14 items-center rounded-full transition-colors duration-300 ${
                                        enabled
                                            ? 'bg-emerald-600'
                                            : 'bg-slate-300'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-300 ${
                                            enabled
                                                ? 'translate-x-9'
                                                : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}